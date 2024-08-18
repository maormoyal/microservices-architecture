const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/user.routes');
const swaggerDocs = require('./swagger/user.swagger');

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
  res.status(200).send({ status: 'User service is running' });
});

// User routes
app.use('/api/users', userRoutes);

// Swagger Docs
swaggerDocs(app);

// Start the server
app.listen(3001, () => {
  console.log('User service running on port 3001');
});
