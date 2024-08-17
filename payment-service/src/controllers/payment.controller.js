const PaymentService = require('../services/payment.service');

const completePayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.body;
    const payment = await PaymentService.completePayment(orderId, userId);
    res.status(200).send(payment);
  } catch (error) {
    res
      .status(500)
      .send({ error: 'Failed to complete payment', details: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const userId = req.user.userId; // Correct user ID extraction
    const paymentId = req.params.id;
    const payment = await PaymentService.getPaymentById(paymentId, userId);
    if (!payment) {
      return res.status(404).send({ message: 'Payment not found' });
    }
    res.status(200).send(payment);
  } catch (error) {
    res
      .status(500)
      .send({ error: 'Failed to retrieve payment', details: error.message });
  }
};

module.exports = {
  getPaymentById,
  completePayment,
};
