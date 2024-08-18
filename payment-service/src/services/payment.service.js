const Payment = require('../db-models/payments.model');
const { sendToQueue } = require('./rabbitmq.service');

const processPayment = async (order) => {
  const { _id: orderId, userId, totalAmount } = order;

  if (!orderId) {
    throw new Error('orderId is required for payment processing');
  }

  console.log(`Initiating payment for orderId: ${orderId}`);

  const payment = new Payment({
    orderId,
    userId,
    amount: totalAmount,
    status: 'pending',
    paymentMethod: 'credit_card',
  });

  await payment.save();

  console.log(`Payment initiated for order ${payment.orderId}`);
  return payment;
};

const getPaymentById = async (paymentId, userId) => {
  const payment = await Payment.findOne({ _id: paymentId, userId });
  return payment;
};

const completePayment = async (orderId, userId) => {
  console.log(`Completing payment for orderId: ${orderId}, userId: ${userId}`);

  const payment = await Payment.findOne({ orderId, userId });

  if (!payment) {
    console.error(
      `Payment not found for orderId: ${orderId}, userId: ${userId}`
    );
    throw new Error('Payment not found');
  }

  if (payment.status === 'completed') {
    console.log(`Payment for orderId: ${orderId} has already been completed.`);
    return payment;
  }

  payment.status = 'completed';
  await payment.save();

  sendToQueue('order_completed', {
    orderId: payment.orderId,
    userId: payment.userId,
    paymentStatus: 'paid',
  });

  console.log(`Payment completed for order ${payment.orderId}`);
  return payment;
};

const processRefund = async (orderId, userId) => {
  const payment = await Payment.findOneAndUpdate(
    { orderId, userId, status: 'completed' },
    { status: 'refunded' },
    { new: true }
  );

  if (!payment) {
    throw new Error('Payment not found or already refunded');
  }

  console.log(`Refund processed for order ${orderId}`);
  return payment;
};

module.exports = {
  processPayment,
  getPaymentById,
  processRefund,
  completePayment,
};
