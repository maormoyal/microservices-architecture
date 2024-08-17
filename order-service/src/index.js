const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const orderRoutes = require('./routes/order.routes');
const swaggerDocs = require('./swagger/order.swagger');
const { rabbitMQConnect } = require('./services/rabbitmq.service');
const { updateOrderStatus } = require('./services/order.service');

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
rabbitMQConnect(updateOrderStatus);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'Order service is running' });
});

// Order routes
app.use('/api/orders', orderRoutes);

// Swagger Docs
swaggerDocs(app);

// Start the server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Order service running on port ${process.env.PORT || 3002}`);
});
