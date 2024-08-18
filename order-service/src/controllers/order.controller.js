const {
  createOrder,
  cancelOrder,
  getOrdersByUserId,
} = require('../services/order.service');

const placeOrder = async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

const cancelOrderById = async (req, res) => {
  try {
    const order = await cancelOrder(req.params.id);
    if (!order) return res.status(404).send({ message: 'Order not found' });
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const orders = await getOrdersByUserId(req.params.userId);
    if (orders.length === 0) {
      return res.status(404).send({ message: 'No orders found for this user' });
    }
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  placeOrder,
  cancelOrderById,
  getOrdersByUser,
};
