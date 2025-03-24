# Order Management API

This repository contains the code for the Order Management API. It includes a backend built with NestJS and a frontend with React. This document will guide you through setting up the project locally or using Docker Compose, as well as running the tests for the backend.


Before you begin, make sure you have the following installed:

- [Node.js]
- [npm]
- [Docker]

## Setup Locally

### 1. Clone the repository:

```bash
git clone https://github.com/IT-T1ma/order-managment-api.git
cd order-managment-api

2. Install dependencies:
For the backend (NestJS):

cd server
npm install

For the frontend

cd client
npm install

3. Configure environment variables:
Copy the .env.example file to .env and update the necessary variables. For example:

cp .env.example .env
Make sure to set the proper values for your database and other required services.

4. Run the project:
Backend (NestJS):

cd server
npm run start:dev
This will start the backend on http://localhost:3333.

Frontend:

cd client
npm run dev
This will start the frontend on http://localhost:5173.


To run the backend tests for the NestJS application, you can use the following command:

cd server
npm run test

[Docker]
Setup with Docker Compose

Ensure you have Docker and Docker Compose installed.
Build and start the containers:

docker-compose up --build