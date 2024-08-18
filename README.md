# PAYMENT - Event-driven microservices system

This project is a microservices-based application that handles user management, orders, and payments.
The system is built using Node.js, Express, MongoDB, RabbitMQ and Docker, with Swagger for API documentation.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Microservices](#microservices)
  - [User Service](#user-service)
  - [Order Service](#order-service)
  - [Payment Service](#payment-service)
- [API Documentation](#api-documentation)
- [Setup and Installation](#setup-and-installation)
  - [Running with Docker](#running-with-docker)
  - [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [License](#license)

## Project Overview

This project is a custom event-driven microservices system designed to handle a high volume of transactions. The system is built using Node.js, Express, MongoDB, and RabbitMQ. It consists of three main microservices: User Service, Order Service, and Payment Service. The system is designed to process different types of events and ensure data consistency across multiple services.

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

| Endpoint                  | Method | Description               | Authentication |
| ------------------------- | ------ | ------------------------- | -------------- |
| `/api/orders`             | POST   | Create a new order        | Yes            |
| `/api/orders/{userId}`    | GET    | Get all orders for a user | Yes            |
| `/api/orders/{id}/cancel` | POST   | Cancel an order by ID     | Yes            |

### Payment Service Endpoints

| Endpoint                 | Method | Description                  | Authentication |
| ------------------------ | ------ | ---------------------------- | -------------- |
| `/api/payments/complete` | POST   | Complete an existing payment | Yes            |
| `/api/payments/{id}`     | GET    | Get payment details by ID    | Yes            |

## Setup and Installation

### running-with-docker - Locally

**Set up a local environment with Docker - Run all microservices with Docker**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/maormoyal/microservices-architecture.git
   cd your-repository
   ```

2. **Install Docker and Docker compose:**  
   Make sure you have Docker installed on your machine. You can download it from Docker's official website.
   You can just download Docker-Desktop at https://www.docker.com/ (Recommend).

3. **Run docker images:**  
   Navigate to the root directory and build and run the Docker images:

```bash
npm run "docker:prod"
```

This command will run "docker-compose up --build" for all the microservices include RabbitMQ and the MongoDB.  
 The services will be available on ports 3001, 3002, and 3003, respectively.

**Access the API Documentation**
Visit http://localhost:<port>/api-docs for each service to view the Swagger documentation.

### Running Locally

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/maormoyal/microservices-architecture.git
   cd your-repository
   ```

2. **Install Dependencies:**  
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

3. **Start MongoDB and RabbitMQ**

Ensure that MongoDB and RabbitMQ are running locally with Docker.
navigate to the root folder and run:

```bash
npm run docker:dev
```

4. **Start the Services**
   Start all microservices parallel:
   navigate to the root folder and run:

```bash
npm run dev:services
```

For each microservice, start the server:

```bash
cd user-service
npm run dev
```

```bash
cd ../order-service
npm run dev
```

```bash
cd ../payment-service
npm run dev
```

The services will be available on ports 3001, 3002, and 3003, respectively.

5. **Access the API Documentation**

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
