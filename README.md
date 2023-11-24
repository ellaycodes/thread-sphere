# ThreadSphere API

## Introduction

ThreadSphere is a news app that provides tech news to share with others. 

## Live Demo

https://thread-sphere.onrender.com/api

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL 

### Installation

1. Clone the repository

git clone https://github.com/ellaycodes/thread-sphere.git
cd thread-sphere

2. Install Dependencies

npm install dotenv
npm install express
npm install jest-sorted
npm install jest
npm install pg
npm install supertest
npm install pg-format

### Environment Variables

To run ThreadSphere locally, you need to set up environment variables. Create `.env.development` and `.env.test` files in the root directory with the following content:

1.  .env.development

PGDATABASE=your_development_database_name_here

2.  .env.test

PGDATABASE=your_test_database_name_here

Replace `your_development_database_name_here` and `your_test_database_url_here` with the actual database URLs.

### Seed the local database

npm run seed

### Running Tests

npm test app.test.js

## API Documentation

The available endpoints, request methods, and expected responses can be found in the endpoints.json file.

## Contact

- Email: 11yekinie@gmail.com