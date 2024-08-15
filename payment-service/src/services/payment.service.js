const Payment = require('../db-models/payments.model');

async function processPayment(order) {
  const payment = new Payment({
    orderId: order._id,
    userId: order.userId,
    amount: order.totalAmount,
    status: 'completed',
    paymentMethod: 'credit_card',
  });
  await payment.save();
  console.log(`Payment processed for order ${order._id}`);
}

async function processRefund(order) {
  const payment = await Payment.findOne({ orderId: order._id });
  if (payment && payment.status === 'completed') {
    payment.status = 'refunded';
    await payment.save();
    console.log(`Refund processed for order ${order._id}`);
  } else {
    console.log(`No completed payment found for order ${order._id}`);
  }
}

module.exports = {
  processPayment,
  processRefund,
};
