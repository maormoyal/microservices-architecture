const express = require('express');
const {
  processPayment,
  getPaymentById,
  processRefund,
  completePayment,
} = require('../controllers/payment.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /api/payments/complete:
 *   post:
 *     summary: Complete an existing payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The ID of the order associated with the payment
 *             required:
 *               - orderId
 *     responses:
 *       200:
 *         description: The payment was successfully completed.
 *       404:
 *         description: Payment not found or already completed.
 */
router.post('/complete', authenticateToken, completePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
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
router.get('/:id', authenticateToken, getPaymentById);

module.exports = router;
