const amqp = require('amqplib/callback_api');
const { processPayment, processRefund } = require('./payment.service');

function rabbitMQConnect() {
  amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, ch) => {
      if (err) throw err;
      const orderPlacedQueue = 'order_placed';
      const orderCancelledQueue = 'order_cancelled';

      ch.assertQueue(orderPlacedQueue, { durable: true });
      ch.assertQueue(orderCancelledQueue, { durable: true });
      console.log(
        'Waiting for messages in %s and %s',
        orderPlacedQueue,
        orderCancelledQueue
      );

      // Listen for the order_placed event
      ch.consume(orderPlacedQueue, async (msg) => {
        if (msg !== null) {
          const order = JSON.parse(msg.content.toString());
          console.log('Received order placed:', order);
          await processPayment(order);
          ch.ack(msg); // Acknowledge that the message has been processed
        }
      });

      // Listen for the order_cancelled event
      ch.consume(orderCancelledQueue, async (msg) => {
        if (msg !== null) {
          const order = JSON.parse(msg.content.toString());
          console.log('Received order cancellation:', order);
          await processRefund(order);
          ch.ack(msg); // Acknowledge that the message has been processed
        }
      });
    });
  });
}

module.exports = {
  rabbitMQConnect,
};
