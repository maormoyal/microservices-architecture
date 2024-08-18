const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const paymentRoutes = require('./routes/payment.routes');
const swaggerDocs = require('./swagger/payment.swagger');
const { rabbitMQConnect } = require('./services/rabbitmq.service');
const {
  processPayment,
  processRefund,
  completePayment,
} = require('./services/payment.service');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// RabbitMQ connection
rabbitMQConnect(processPayment, processRefund, completePayment);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'Payment service is running' });
});

// Payment routes
app.use('/api/payments', paymentRoutes);

// Swagger Docs
swaggerDocs(app);

// Start the server
app.listen(process.env.PORT || 3003, () => {
  console.log(`Payment service running on port ${process.env.PORT || 3003}`);
});
