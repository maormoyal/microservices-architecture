const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'API documentation for the Order Service',
    },
    servers: [
      {
        url: 'http://localhost:3002',
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
        Order: {
          type: 'object',
          required: ['userId', 'items', 'totalAmount'],
          properties: {
            userId: {
              type: 'string',
              description: 'The ID of the user placing the order',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'string',
                    description: 'The ID of the product',
                  },
                  quantity: {
                    type: 'integer',
                    description: 'Quantity of the product',
                  },
                  price: {
                    type: 'number',
                    description: 'Price of the product',
                  },
                },
              },
            },
            totalAmount: {
              type: 'number',
              description: 'Total amount for the order',
            },
            status: {
              type: 'string',
              enum: ['placed', 'cancelled'],
              description: 'The status of the order',
            },
          },
          example: {
            userId: '60f7b2a8c9a1f7842fbca380',
            items: [
              {
                productId: 'abc123',
                quantity: 2,
                price: 19.99,
              },
            ],
            totalAmount: 39.98,
            status: 'placed',
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
