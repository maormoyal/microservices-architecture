const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const orderRoutes = require('./routes/order.routes');
const swaggerDocs = require('./swagger/order.swagger');
const { rabbitMQConnect } = require('./services/rabbitmq.service');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// RabbitMQ connection
rabbitMQConnect();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'Order service is running' });
});

// Order routes
app.use('/api/orders', orderRoutes);

// Swagger Docs
swaggerDocs(app);

// Start the server
app.listen(3002, () => {
  console.log('Order service running on port 3002');
});
