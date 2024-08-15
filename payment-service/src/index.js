const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const Payment = require('./db-models/payments.model');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// RabbitMQ connection
let channel = null;
amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
  if (err) throw err;
  conn.createChannel((err, ch) => {
    if (err) throw err;
    channel = ch;
    channel.assertQueue('payment_processed', { durable: true });
    console.log('Connected to RabbitMQ');
  });
});

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Service API',
      version: '1.0.0',
      description: 'API documentation for the Payment Service',
      contact: {
        name: 'Maor moyal',
        email: 'maorkab@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - orderId
 *         - userId
 *         - amount
 *         - paymentMethod
 *       properties:
 *         orderId:
 *           type: string
 *           description: The ID of the related order.
 *         userId:
 *           type: string
 *           description: The ID of the user making the payment.
 *         amount:
 *           type: number
 *           description: The payment amount.
 *         status:
 *           type: string
 *           description: The status of the payment (pending, completed, failed).
 *         paymentMethod:
 *           type: string
 *           description: The payment method used.
 *       example:
 *         orderId: "60f7b2a8c9a1f7842fbca380"
 *         userId: "60f7b2a8c9a1f7842fbca381"
 *         amount: 39.98
 *         status: pending
 *         paymentMethod: credit_card
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Process a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: The payment was successfully processed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Bad request. Invalid input.
 */
app.post('/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    channel.sendToQueue(
      'payment_processed',
      Buffer.from(JSON.stringify(payment))
    );
    res.status(201).send(payment);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: The payment information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 */
app.get('/payments/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).send({ message: 'Payment not found' });
    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(3003, () => {
  console.log('Payment service running on port 3003');
});
