const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Service API',
      version: '1.0.0',
      description: 'API documentation for the Payment Service',
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Payment: {
          type: 'object',
          required: ['orderId', 'amount', 'status'],
          properties: {
            orderId: {
              type: 'string',
              description: 'The ID of the order associated with the payment',
            },
            amount: {
              type: 'number',
              description: 'The amount of the payment',
            },
            status: {
              type: 'string',
              enum: ['completed', 'failed', 'refunded'],
              description: 'The status of the payment',
            },
          },
          example: {
            orderId: '60f7b2a8c9a1f7842fbca380',
            amount: 39.98,
            status: 'completed',
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
