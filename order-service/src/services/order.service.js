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

async function updateOrderStatus(orderId, paymentStatus) {
  try {
    console.log(
      `Updating order ${orderId} with paymentStatus ${paymentStatus}`
    );
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = paymentStatus;
      order.status = 'completed';
      await order.save();
      console.log(
        `Order ${orderId} updated with paymentStatus ${paymentStatus}`
      );
    } else {
      console.error(`Order with ID ${orderId} not found.`);
    }
  } catch (error) {
    console.error(`Failed to update order ${orderId}:`, error.message);
  }
}

module.exports = {
  createOrder,
  cancelOrder,
  getOrdersByUserId,
  updateOrderStatus,
};
