# ThreadSphere API

## Introduction

Welcome to ThreadSphere, a Reddit-inspired API that allows users to interact with a variety of data related to articles, comments, and users. This project demonstrates the use of RESTful API principles to create an accessible and intuitive interface for data manipulation and retrieval.

## Live Demo

Experience the ThreadSphere API in action: https://thread-sphere.onrender.com/api

## Getting Started

### Prerequisites

As a prerequisite you'll need:

Node.js (minimum version: 14.x)
PostgreSQL (minimum version: 12.x)

### Installation

1. Clone the repository

git clone https://github.com/ellaycodes/thread-sphere.git
cd thread-sphere

2. Install Dependencies

ThreadSphere relies on several Node.js packages including:

npm install dotenv
npm install express
npm install jest-sorted
npm install jest
npm install pg
npm install supertest
npm install pg-format

### Environment Variables

 Create `.env.development` and `.env.test` files in the root directory with the following content:

1.  .env.development

PGDATABASE=your_development_database_name_here

2.  .env.test

PGDATABASE=your_test_database_name_here

Replace `your_development_database_name_here` and `your_test_database_url_here` with the actual database URLs.

### Seed the local database

Populate your database with initial data to start testing and development. 
npm run seed

### Running Tests

npm test app.test.js

## Project Structure

ThreadSphere is organized for easy navigation:

/tests - Automated tests for the API endpoints.
/controllers - Functions that directly interact with the database.
/db - Database data and seeds to create, seed, and connect the database.
/models - Database models defining the structure of the database tables.

## API Documentation

The available endpoints, request methods, and expected responses can be found by following this link https://thread-sphere.onrender.com/api.

## Contributing 

Interested in contributing? Great! You can start by:

Forking the repository.
Making your changes.
Creating a pull request with a detailed description of your additions.

## Contact

- Email: 11yekinie@gmail.com