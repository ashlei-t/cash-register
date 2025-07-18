# Cash Register

This cash register application adds products to a cart and computes the total price. It applies pricing rules based on quantities. This application was built with a Ruby on Rails backend and React JS frontend.

## Prerequisites

- Node.js: version 14 or higher (tested with 16+)
- Ruby: version 3.2.2 or higher
- Rails: version 6.1 or higher

## Installation

1. Install backend dependencies:
   ```bash
   bundle install
   rails db:create db:migrate db:seed
   ```
The application includes a seed file that populates the database with sample products and pricing rules.

3. Install frontend dependencies:
   ```bash
   cd frontend/
   npm install
   ```

## Running the Application

### Backend

From the project directory:
```bash
rails server -p 3001
```
The backend will run on [http://localhost:3001](http://localhost:3001)

### Frontend

From the frontend directory:
```bash
cd frontend
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
rspec
```
Runs the test suite for pricing rules and other backend functionality.


## Features

- Add products to cart
- Apply quantity-based pricing rules
- Calculate total price with discounts
- Real-time cart updates

## API Endpoints

## API Endpoints

| Method | Endpoint                                | Description                                             |
|--------|------------------------------------------|---------------------------------------------------------|
| GET    | `/items`                                 | Fetch all available products                            |
| POST   | `/carts`                                 | Create a new cart                                       |
| GET    | `/carts/:id`                             | Fetch a specific cart                                   |
| POST   | `/carts/:cart_id/cart_items`             | Add item to cart                                        |
| PUT    | `/cart_items`                            | Update item quantity (requires `cart_id`, `code`, `quantity`) |
| DELETE | `/cart_items`                            | Remove item from cart (requires `cart_id`, `code`)      |
| DELETE | `/carts/:id/clear`                       | Remove all items from the cart                          |
| POST   | `/carts/:id/checkout`                    | Checkout the cart and return the final total            |
