const Payment = require('../db-models/payments.model');

const processPayment = async (req, res) => {
  try {
    // Your logic to process the payment
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).send(payment);
  } catch (error) {
    res.status(500).send({ error: 'Failed to process payment' });
  }
};

const processRefund = async (req, res) => {
  try {
    // Your logic to process the refund
    const payment = await Payment.findOne({ orderId: req.body.orderId });
    if (payment && payment.status === 'completed') {
      payment.status = 'refunded';
      await payment.save();
      res.status(200).send(payment);
    } else {
      res.status(404).send({ error: 'Payment not found or already refunded' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to process refund' });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).send({ error: 'Payment not found' });
    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve payment' });
  }
};

module.exports = {
  processPayment,
  processRefund,
  getPaymentById,
};
