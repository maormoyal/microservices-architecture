// order-service/src/services/order.service.js
const Order = require('../db-models/orders.model');
const { sendToQueue } = require('./rabbitmq.service');

async function createOrder(orderData) {
  const order = new Order(orderData);
  await order.save();
  sendToQueue('order_placed', order);
  return order;
}

async function cancelOrder(orderId) {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: 'cancelled' },
    { new: true }
  );
  if (order) {
    sendToQueue('order_cancelled', order);
  }
  return order;
}

async function getOrdersByUserId(userId) {
  const orders = await Order.find({ userId });
  return orders;
}

module.exports = {
  createOrder,
  cancelOrder,
  getOrdersByUserId,
};
