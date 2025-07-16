# Cash Register

This cash register application adds products to a cart and computes the total price. It applies pricing rules based on quantities. This application was built with a Ruby on Rails backend and React JS frontend.

## Prerequisites

- Node.js (version 14 or higher)
- Ruby (version 2.7 or higher)
- Rails (version 6 or higher)
- PostgreSQL or SQLite3

## Installation

1. Clone the repository:
   ```bash
   git clone
   cd cash-register
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   bundle install
   ```

3. Set up the database:
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Backend

From the backend directory:
```bash
rails server -p 3001
```
The backend will run on [http://localhost:3001](http://localhost:3001)

### Frontend

From the frontend directory:
```bash
npm start
```
The frontend will run on [http://localhost:3000](http://localhost:3000)

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```
Launches the test runner in interactive watch mode.

### Backend Tests
```bash
cd backend
rspec
```
Runs the test suite for pricing rules and other backend functionality.

## Database Setup

The application includes a seed file that populates the database with sample products and pricing rules. Run the seed command during setup:
```bash
rails db:seed
```

## Features

- Add products to cart
- Apply quantity-based pricing rules
- Calculate total price with discounts
- Real-time cart updates

## API Endpoints

- `GET /api/products` - Retrieve all products
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get current cart
- `DELETE /api/cart/remove/:id` - Remove item from cart
