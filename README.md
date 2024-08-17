# Microservices Project

This project is a microservices-based application that handles user management, orders, and payments. The system is built using Node.js, Express, MongoDB, and RabbitMQ, with Swagger for API documentation.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Microservices](#microservices)
  - [User Service](#user-service)
  - [Order Service](#order-service)
  - [Payment Service](#payment-service)
- [API Documentation](#api-documentation)
- [Setup and Installation](#setup-and-installation)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [Environment Variables](#environment-variables)
- [License](#license)

## Project Overview

This project is designed as a microservices architecture with separate services for managing users, orders, and payments. The services communicate with each other via RabbitMQ, enabling asynchronous processing of orders and payments.

### Features

- User registration, login, and profile management.
- Order placement, cancellation, and retrieval.
- Payment processing and status updates.
- API documentation using Swagger.

## Architecture

The project consists of three main microservices:

1. **User Service**: Manages user registration, authentication, and profile information.
2. **Order Service**: Handles the creation, updating, and retrieval of orders.
3. **Payment Service**: Processes payments and updates order status based on payment results.

The services communicate via RabbitMQ, where messages are sent and consumed to handle various operations like order placement and payment completion.

## Microservices

### User Service

The User Service is responsible for user management, including registration, login, and profile management.

- **Technology Stack**: Node.js, Express, MongoDB, JWT, bcrypt.
- **Port**: `3001`

### Order Service

The Order Service manages the lifecycle of orders, including their creation, update, and cancellation.

- **Technology Stack**: Node.js, Express, MongoDB, RabbitMQ.
- **Port**: `3002`

### Payment Service

The Payment Service handles payment processing, updating the status of orders based on payment outcomes.

- **Technology Stack**: Node.js, Express, MongoDB, RabbitMQ.
- **Port**: `3003`

## API Documentation

### User Service Endpoints

| Endpoint              | Method | Description                          | Authentication |
| --------------------- | ------ | ------------------------------------ | -------------- |
| `/api/users/register` | POST   | Register a new user                  | No             |
| `/api/users/login`    | POST   | Login a user                         | No             |
| `/api/users/me`       | GET    | Get the authenticated user's profile | Yes            |
| `/api/users/logout`   | POST   | Logout a user                        | Yes            |

### Order Service Endpoints

| Endpoint               | Method | Description               | Authentication |
| ---------------------- | ------ | ------------------------- | -------------- |
| `/api/orders`          | POST   | Create a new order        | Yes            |
| `/api/orders/:orderId` | GET    | Get an order by ID        | Yes            |
| `/api/orders`          | GET    | Get all orders for a user | Yes            |
| `/api/orders/:orderId` | PATCH  | Update an order's status  | Yes            |
| `/api/orders/:orderId` | DELETE | Cancel an order           | Yes            |

### Payment Service Endpoints

| Endpoint                   | Method | Description               | Authentication |
| -------------------------- | ------ | ------------------------- | -------------- |
| `/api/payments`            | POST   | Process a payment         | Yes            |
| `/api/payments/:paymentId` | GET    | Get payment details by ID | Yes            |

## Setup and Installation

### Running all microservices with Docker

Navigate to the root directory and build the Docker images for each service:

```bash
npm run "docker:prod"
```

This command will run "docker-compose up --build" for all the microservices include RabbitMQ and the MongoDB.  
 The services will be available on ports 3001, 3002, and 3003, respectively.

**Access the API Documentation**
Visit http://localhost:<port>/api-docs for each service to view the Swagger documentation.

### Running Locally

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repository.git
   cd your-repository
   ```

2. **Install Dependencies**  
   For each microservice, navigate to its directory and install the dependencies:

```bash
cd user-service
npm install
```

```bash
cd ../order-service
npm install
```

```bash
cd ../payment-service
npm install
```

3. **Set Up Environment Variables**

Create a .env file in each service's directory based on the .env.example file provided.

4. **Start MongoDB and RabbitMQ**

Ensure that MongoDB and RabbitMQ are running locally.

5. **Start the Services**

For each microservice, start the server:

```bash
cd user-service
npm start
```

```bash
cd ../order-service
npm start
```

```bash
cd ../payment-service
npm start
```

The services will be available on ports 3001, 3002, and 3003, respectively.

6. **Access the API Documentation**

Visit http://localhost:<port>/api-docs for each service to view the Swagger documentation.

### Environment Variables

Each microservice requires specific environment variables. Below are the common variables:

MONGO_URL: MongoDB connection string.
RABBITMQ_URL: RabbitMQ connection string.
JWT_SECRET: Secret key for JWT tokens.
PORT: Port number for the service.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
contact maorkab@gmail.com
