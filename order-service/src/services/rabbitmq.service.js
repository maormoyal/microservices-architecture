const amqp = require('amqplib/callback_api');

let channel = null;

function rabbitMQConnect() {
  amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, ch) => {
      if (err) throw err;
      channel = ch;
      channel.assertQueue('order_placed', { durable: true });
      channel.assertQueue('order_cancelled', { durable: true });
      console.log('Connected to RabbitMQ');
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
