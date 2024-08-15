const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const paymentRoutes = require('./routes/payment.routes');
const swaggerDocs = require('./swagger/payment.swagger');

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'Payment service is running' });
});

// Payment routes
app.use('/api/payments', paymentRoutes);

// Swagger Docs
swaggerDocs(app);

// Start the server
app.listen(3003, () => {
  console.log('Payment service running on port 3003');
});
