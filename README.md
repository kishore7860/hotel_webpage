# Star Chicken - Food Ordering Web Application

A full-stack food ordering application for Star Chicken restaurant.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3)

## Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
npm run seed   # Seed the database with sample data
npm run dev    # Start backend on http://localhost:3000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev    # Start frontend on http://localhost:5173
```

### 3. Access the Application

Open http://localhost:5173 in your browser.

## Test Credentials

- Email: `test@example.com`
- Password: `password123`

## Sample Discount Codes

- `WELCOME10` - 10% off (min order ₹200)
- `FLAT50` - ₹50 off (min order ₹300)
- `AXISREWARDS` - ₹150 off (min order ₹500)

## Features

### User Authentication
- Register with name, email, phone, password
- Login with email/password (JWT-based)
- Protected routes for profile and rewards

### Menu Browsing
- Browse by categories
- View featured items
- Item details with add to cart

### Cart & Checkout
- Add/remove items
- Quantity adjustments
- Special instructions
- Discount codes
- Reward points redemption
- Pickup or Carryout options

### Rewards System
- Earn 1 point per ₹10 spent
- Redeem 100 points = ₹10 discount
- View points balance and history

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/auth/me` | Get current user |
| GET | `/api/v1/categories` | Get all categories |
| GET | `/api/v1/menu` | Get all menu items |
| GET | `/api/v1/menu/featured` | Get featured items |
| GET | `/api/v1/menu/category/:id` | Get items by category |
| GET | `/api/v1/menu/:id` | Get item details |
| POST | `/api/v1/orders` | Create new order |
| GET | `/api/v1/orders/:orderNumber` | Get order details |
| GET | `/api/v1/orders/my-orders` | Get user's orders |
| GET | `/api/v1/rewards/balance` | Get reward points |
| GET | `/api/v1/rewards/history` | Get transactions |
| POST | `/api/v1/discounts/validate` | Validate discount |

## Restaurant Info

- **Name:** Star Chicken
- **Rating:** 4.2 (46 ratings)
- **Location:** New BusStand, Shop No: Room no-13, NEW RTC BUSSTAND COMPLEX, NAGARAJUPET
- **FSSAI License:** 20125232000486
- **Prep Time:** 30-35 mins
# hotel_webpage
