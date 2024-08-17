const amqp = require('amqplib/callback_api');
require('dotenv').config();

let channel = null;

function rabbitMQConnect(updateOrderStatusFn) {
  amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, ch) => {
      if (err) throw err;
      channel = ch;
      channel.assertQueue('order_placed', { durable: true });
      channel.assertQueue('order_cancelled', { durable: true });
      channel.assertQueue('order_completed', { durable: true });
      console.log('Connected to RabbitMQ');

      ch.consume('order_completed', async (msg) => {
        if (msg !== null) {
          const { orderId, paymentStatus } = JSON.parse(msg.content.toString());
          console.log(
            `Received order completed: ${orderId} with status ${paymentStatus}`
          );
          await updateOrderStatusFn(orderId, paymentStatus);
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
