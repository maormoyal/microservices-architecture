const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const Order = require('./db-models/orders.model');

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
    channel.assertQueue('order_placed', { durable: true });
    channel.assertQueue('order_cancelled', { durable: true });
    console.log('Connected to RabbitMQ');
  });
});

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'API documentation for the Order Service',
      contact: {
        name: 'Your Name',
        email: 'your.email@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3002',
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
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - items
 *         - totalAmount
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user who placed the order.
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         totalAmount:
 *           type: number
 *           description: The total amount of the order.
 *         status:
 *           type: string
 *           description: The status of the order (placed or cancelled).
 *       example:
 *         userId: "60f7b2a8c9a1f7842fbca380"
 *         items:
 *           - productId: "abc123"
 *             quantity: 2
 *             price: 19.99
 *         totalAmount: 39.98
 *         status: placed
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: The order was successfully placed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request. Invalid input.
 */
app.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    channel.sendToQueue('order_placed', Buffer.from(JSON.stringify(order)));
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send({ message: 'Order not found' });
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     summary: Cancel an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order was successfully cancelled.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
app.post('/orders/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!order) return res.status(404).send({ message: 'Order not found' });
    channel.sendToQueue('order_cancelled', Buffer.from(JSON.stringify(order)));
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(3002, () => {
  console.log('Order service running on port 3002');
});
