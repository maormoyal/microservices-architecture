const amqp = require('amqplib/callback_api');
require('dotenv').config();

let channel = null;

function rabbitMQConnect(processPaymentFn, processRefundFn, completePaymentFn) {
  amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ:', err.message);
      setTimeout(
        () =>
          rabbitMQConnect(processPaymentFn, processRefundFn, completePaymentFn),
        5000
      );
      return;
    }
    conn.createChannel((err, ch) => {
      if (err) throw err;
      channel = ch;
      channel.assertQueue('order_placed', { durable: true });
      channel.assertQueue('order_cancelled', { durable: true });
      channel.assertQueue('order_completed', { durable: true });
      console.log('Connected to RabbitMQ');

      ch.consume('order_placed', async (msg) => {
        if (msg !== null) {
          const order = JSON.parse(msg.content.toString());
          console.log('Received order placed:', order);
          await processPaymentFn(order);
          ch.ack(msg);
        }
      });

      ch.consume('order_cancelled', async (msg) => {
        if (msg !== null) {
          const order = JSON.parse(msg.content.toString());
          console.log('Received order cancellation:', order);
          await processRefundFn(order._id.toString(), order.userId.toString());
          ch.ack(msg);
        }
      });

      ch.consume('order_completed', async (msg) => {
        if (msg !== null) {
          const { orderId, userId, paymentStatus } = JSON.parse(
            msg.content.toString()
          );
          console.log('Received order completed:', { orderId, paymentStatus });
          await completePaymentFn(orderId, userId);
          ch.ack(msg);
        }
      });
    });
  });
}

function sendToQueue(queueName, message) {
  if (channel) {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }
}

module.exports = {
  rabbitMQConnect,
  sendToQueue,
};
