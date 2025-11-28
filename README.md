# Cash Register

A modern cash register application for managing shopping carts with automatic discount pricing rules. Built with a Ruby on Rails API backend and a React frontend.

## 🎯 Overview

This application allows customers to:
- Browse available products (Coffee, Green Tea, Strawberries)
- Add items to a shopping cart
- Automatically apply quantity-based pricing rules and discounts
- View real-time cart totals with discount calculations

## 🛠️ Tech Stack

**Backend:**
- Ruby on Rails 8.0.2
- SQLite3 database
- RESTful API architecture

**Frontend:**
- React 19.1.0
- React Router 7.6.3
- Axios for API calls
- Bootstrap 5.3.7 for styling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: version 14 or higher (tested with 16+)
- **Ruby**: version 3.2.2 or higher
- **Rails**: version 8.0.2
- **Bundler**: `gem install bundler`
- **npm**: Comes with Node.js

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashlei-t/cash-register.git
   cd cash-register
   ```

2. **Install backend dependencies:**
   ```bash
   bundle install
   rails db:create db:migrate db:seed
   ```

   > **Note:** If you encounter any errors during setup, make sure you have Ruby 3.2.2+ and Node.js 14+ installed.

   The seed file populates the database with sample products:
   - **GR1** - Green Tea (€3.11)
   - **SR1** - Strawberries (€5.00)
   - **CF1** - Coffee (€11.23)

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## ▶️ Running the Application

### Backend Server

From the project root directory:
```bash
rails server -p 3001
```

The backend API will be available at [http://localhost:3001](http://localhost:3001)

### Frontend Server

From the frontend directory (or project root):
```bash
cd frontend
npm start
```

The frontend will automatically open at [http://localhost:3000](http://localhost:3000)

> **Note:** Both servers need to be running simultaneously for the application to work properly.

## 🧪 Testing

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

## ✨ Features

- ✅ Add and remove products from cart
- ✅ Real-time quantity updates
- ✅ Automatic discount calculation based on pricing rules
- ✅ Visual discount indicators
- ✅ Cart summary with itemized totals
- ✅ Checkout functionality

## 💰 Pricing Rules

The application automatically applies the following pricing rules:

### 1. Buy One Get One Free (BOGOF)
- **Product:** Green Tea (GR1)
- **Rule:** Buy 1, Get 1 Free
- **Example:** 2 Green Teas = Pay for 1 (€3.11), 3 Green Teas = Pay for 2 (€6.22)

### 2. Bulk Discount
- **Product:** Strawberries (SR1)
- **Rule:** Buy 3 or more, price drops to €4.50 each
- **Example:** 3 Strawberries = €13.50 (instead of €15.00)

### 3. Buy More Save More
- **Product:** Coffee (CF1)
- **Rule:** Buy 3 or more, get 33% off (pay 2/3 of original price)
- **Example:** 3 Coffee = €22.47 (instead of €33.69)

## 📡 API Endpoints

| Method | Endpoint                                | Description                                             |
|--------|------------------------------------------|---------------------------------------------------------|
| GET    | `/items`                                 | Fetch all available products                            |
| POST   | `/carts`                                 | Create a new cart                                       |
| GET    | `/carts/:id`                             | Fetch a specific cart with calculated prices           |
| POST   | `/carts/:cart_id/cart_items`             | Add item to cart (requires `code`, `quantity`)          |
| PUT    | `/carts/:cart_id/cart_items/:code`       | Update item quantity (requires `quantity` in body)      |
| DELETE | `/carts/:cart_id/cart_items/:code`       | Remove item from cart                                   |
| DELETE | `/carts/:id/clear`                       | Remove all items from the cart                          |
| POST   | `/carts/:id/checkout`                    | Checkout the cart and return the final receipt          |

### Example API Request

**Add item to cart:**
```bash
POST /carts/1/cart_items
Content-Type: application/json

{
  "code": "GR1",
  "quantity": 2
}
```

## 📁 Project Structure

```
cash-register/
├── app/
│   ├── controllers/          # API endpoints
│   ├── models/              # Database models (Item, Cart, CartItem)
│   └── services/            # Business logic (CartPriceCalculator, PricingRules)
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (Home, Cart)
│   │   └── api/             # API client functions
├── db/
│   ├── migrate/             # Database migrations
│   └── seeds.rb             # Sample data
└── config/
    └── routes.rb            # API routes
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
