# 🛒 CartWise – Full Stack E-Commerce Web Application

**CartWise** is a full-stack e-commerce web application developed using React.js, Node.js, Express.js, and PostgreSQL. It provides an online shopping experience where customers can browse products, search products, add items to their cart, manage wishlists, place orders, track orders, and manage their profiles.

The application also provides a separate Admin Panel that allows administrators to manage products, users, orders, inventory, and dashboard statistics.

---

# 1. Project Overview

## Project Name
CartWise – Full Stack E-Commerce Application

## Project Type
Full Stack Web Development Project

## Main Objective

The main objective of CartWise is to develop an online shopping platform that provides a simple, secure, and user-friendly shopping experience.

The project follows a client-server architecture:

- **Frontend:** React.js
- **Backend:** Node.js and Express.js
- **Database:** PostgreSQL
- **Authentication:** JSON Web Token (JWT)
- **Password Security:** bcryptjs
- **Email Service:** Nodemailer

## Main Features

### Customer Features
- User registration and login.
- Customer and Admin login selection.
- Browse available products.
- Search products.
- Filter products by category.
- Sort products by price and date.
- Add products to cart.
- Remove products from cart.
- Add and remove products from wishlist.
- Checkout and place orders.
- View order history.
- Track order status.
- Manage user profile.
- Manage shipping addresses.
- Forgot password using email OTP.
- Reset password securely.

### Admin Features
- Separate Admin Panel.
- Admin authentication using Business ID.
- Dashboard statistics.
- View and manage products.
- Add new products.
- Update product details.
- Delete products.
- View low-stock products.
- Manage orders.
- Update order status.
- View registered users.
- Update user roles.
- Delete users.
- View recent orders and sales analytics.

---

# 2. Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development server |
| JavaScript | Application logic |
| CSS3 | Styling and responsive design |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| PostgreSQL | Relational database |
| pg | PostgreSQL database connection |
| JWT | User authentication |
| bcryptjs | Password hashing |
| Nodemailer | Sending OTP emails |
| dotenv | Environment variable management |
| CORS | Cross-origin communication |
| Lucide React | Icons |
| Git | Version control |
| GitHub | Source code hosting |

---

# 3. Project Architecture

CartWise follows a three-layer architecture.

```text
                 USER
                   |
                   v
          REACT FRONTEND
              (Vite)
                   |
                   | HTTP Requests
                   | REST API
                   v
          NODE.JS + EXPRESS
              BACKEND
                   |
                   | SQL Queries
                   v
             POSTGRESQL
               DATABASE
```

## How the Architecture Works

1. The user interacts with the React frontend.
2. React sends HTTP requests to the Express backend.
3. Express receives the requests through API routes.
4. Middleware checks authentication and authorization when required.
5. Controllers handle application logic.
6. Models execute SQL queries using PostgreSQL.
7. PostgreSQL returns the requested data.
8. The backend sends JSON responses to the frontend.
9. React updates the user interface.

---

# 4. Complete Project Folder Structure

```text
CartWise/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── passwordResetController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── userController.js
│   │   │   ├── reviewController.js
│   │   │   ├── wishlistController.js
│   │   │   └── addressController.js
│   │   │
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   ├── productModel.js
│   │   │   ├── cartModel.js
│   │   │   ├── orderModel.js
│   │   │   ├── dashboardModel.js
│   │   │   ├── reviewModel.js
│   │   │   ├── wishlistModel.js
│   │   │   └── addressModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── wishlistRoutes.js
│   │   │   └── addressRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   │
│   │   ├── utils/
│   │   │   └── emailService.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Login.jsx
│   │   └── AdminPanel.jsx
│   │
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

*Note: This tree describes the main application files. Other configuration and static asset files may also exist.*

---

# 5. Frontend Explanation

The frontend is developed using React.js.

React is responsible for displaying the application interface and managing user interactions.

## Important Frontend Files

### App.jsx

This is the main application component.

Responsibilities:

- Displays the product catalog.
- Manages cart state.
- Manages wishlist state.
- Handles product search and filtering.
- Handles login state.
- Communicates with backend APIs.
- Displays My Orders.
- Displays Order Tracking.
- Manages user profile and addresses.
- Displays the Admin Panel for administrators.

### Login.jsx

Handles authentication-related operations:

- Customer login.
- Admin login.
- User registration.
- Forgot password.
- OTP verification.
- Password reset.

### AdminPanel.jsx

Provides the administrative interface.

Responsibilities:

- Dashboard statistics.
- Product management.
- Order management.
- User management.
- Low-stock product information.

### App.css

Contains the application's styling, including:

- Navigation bar.
- Product cards.
- Cart layout.
- Wishlist section.
- Login and registration forms.
- Profile section.
- Order cards.
- Admin dashboard.
- Responsive styling.

## React Concepts Used

### useState

Used to store and update component state.

Example:

```jsx
const [cart, setCart] = useState([]);
```

Here, `cart` stores cart items and `setCart` updates them.

### useEffect

Used to execute operations when a component loads or when dependencies change.

Example:

```jsx
useEffect(() => {
    fetchProducts();
}, []);
```

This fetches products when the component initially loads.

### Fetch API

Used to communicate with backend APIs.

Example:

```javascript
const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products`
);

const data = await response.json();
```

---

# 6. Backend Explanation

The backend is developed using Node.js and Express.js.

It handles business logic, authentication, database operations, and API requests.

## Backend Folder Responsibilities

### config/

Contains database configuration.

`db.js` creates a PostgreSQL connection pool using the `pg` package.

### routes/

Defines API endpoints and connects them to controller functions.

Example:

```javascript
router.get("/", getProducts);
```

### controllers/

Contains the application's business logic.

Example:

- Validate incoming data.
- Check user permissions.
- Call database models.
- Return JSON responses.

### models/

Contains database queries.

Models communicate directly with PostgreSQL.

### middleware/

Contains functions that execute before protected route handlers.

`authMiddleware.js` verifies JWT tokens.

`adminMiddleware.js` checks whether the authenticated user has administrator permissions.

### utils/

Contains reusable utility functions.

`emailService.js` handles email delivery using Nodemailer.

### server.js

The main backend entry point.

It:

- Loads environment variables.
- Creates the Express application.
- Enables JSON parsing and CORS.
- Connects API routes.
- Starts the backend server.

---

# 7. Database Design

CartWise uses PostgreSQL as its relational database.

The main database name is:

```text
cartwise
```

## Database Tables

### 1. users

Stores registered user information.

Important columns:

- id
- name
- email
- password
- role
- created_at

The role column distinguishes between customers and administrators.

### 2. products

Stores product information.

Important columns:

- id
- name
- description
- price
- image_url
- category
- stock
- created_at

### 3. orders

Stores customer orders.

Important columns:

- id
- user_id
- total_amount
- status
- shipping_address
- created_at

### 4. order_items

Stores individual products belonging to an order.

Important columns:

- id
- order_id
- product_id
- quantity
- price

### 5. cart_items

Stores products added to customer carts.

Important columns:

- id
- user_id
- product_id
- quantity
- created_at

### 6. reviews

Stores product ratings and comments.

Important columns:

- id
- user_id
- product_id
- rating
- comment
- created_at

The rating must be between 1 and 5.

### 7. wishlist

Stores products saved by customers.

Important columns:

- id
- user_id
- product_id
- created_at

### 8. order_status_history

Stores changes in order status.

Important columns:

- id
- order_id
- status
- changed_at

### 9. password_reset_otps

Stores password reset OTP information.

Important columns:

- id
- user_id
- otp_hash
- expires_at
- is_verified
- created_at

### 10. addresses

Stores customer shipping addresses.

Important columns:

- id
- user_id
- full_name
- phone
- address_line1
- address_line2
- landmark
- city
- state
- postal_code
- country
- is_default
- created_at

## Database Relationships

```text
USERS
  |
  |---- CART_ITEMS
  |
  |---- ORDERS
  |       |
  |       |---- ORDER_ITEMS
  |       |
  |       |---- ORDER_STATUS_HISTORY
  |
  |---- REVIEWS
  |
  |---- WISHLIST
  |
  |---- ADDRESSES
  |
  |---- PASSWORD_RESET_OTPS

PRODUCTS
  |
  |---- CART_ITEMS
  |
  |---- ORDER_ITEMS
  |
  |---- REVIEWS
  |
  |---- WISHLIST
```

## Important Database Concepts Used

- Primary Keys
- Foreign Keys
- Unique Constraints
- Check Constraints
- JOIN
- INSERT
- SELECT
- UPDATE
- DELETE
- Transactions
- SQL Parameterized Queries

---

# 8. Authentication and Authorization

CartWise uses JWT-based authentication.

## Registration Process

1. Customer enters name, email, and password.
2. Frontend sends registration data to the backend.
3. Backend validates the input.
4. Backend checks whether the email already exists.
5. Password is hashed using bcryptjs.
6. User information is stored in PostgreSQL.
7. The new account receives the default `user` role.

Passwords are never stored as plain text.

## Login Process

1. User selects Customer or Admin.
2. User enters email and password.
3. Admin must also provide the Business ID.
4. Backend finds the user by email.
5. bcrypt compares the entered password with the stored hash.
6. Backend checks the requested account type and role.
7. If valid, the server generates a JWT.
8. Frontend stores the token and user information.

## JWT Authentication

JWT stands for JSON Web Token.

It is used to verify the identity of authenticated users.

Example:

```javascript
const token = jwt.sign(
    {
        id: user.id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);
```

The frontend sends the token in the Authorization header:

```javascript
headers: {
    Authorization: `Bearer ${token}`
}
```

## Authentication Middleware

The `protect` middleware:

1. Reads the Authorization header.
2. Extracts the JWT token.
3. Verifies the token using the secret key.
4. Decodes the user information.
5. Adds the authenticated user to `req.user`.
6. Allows the request to continue.

## Admin Authorization

The Admin middleware checks:

```javascript
req.user.role === "admin"
```

Only authenticated administrators can access protected administrative routes.

**Important:** Business ID is an additional application-level access check, not a replacement for JWT authentication or role authorization.

---

# 9. Product Management

Product management is handled through product APIs.

Customers can:

- View all products.
- Search by product name.
- Filter by category.
- Sort products.
- View product details.

Administrators can:

- Add products.
- Update products.
- Delete products.
- View low-stock products.
- Update stock quantities.

The product API supports pagination and sorting.

Supported sorting options:

- newest
- oldest
- price_low
- price_high

---

# 10. Shopping Cart

The cart allows customers to select products before checkout.

## Cart Workflow

1. Customer clicks Add to Cart.
2. Frontend sends the product ID to the backend.
3. Backend checks the authenticated user.
4. The product is added to the user's cart in PostgreSQL.
5. If the product already exists, its quantity is increased.
6. The cart is fetched with product details and subtotal.

The cart data is user-specific.

---

# 11. Wishlist

The wishlist allows customers to save products for future purchases.

Features:

- Add products to wishlist.
- Remove products from wishlist.
- View saved products.
- Add wishlist products to cart.
- Display wishlist count.

Wishlist data is stored in PostgreSQL.

---

# 12. Checkout and Order Placement

Checkout converts the customer's cart into an order.

## Order Placement Workflow

```text
CUSTOMER
   |
   v
ADD PRODUCTS TO CART
   |
   v
PROCEED TO CHECKOUT
   |
   v
ENTER SHIPPING ADDRESS
   |
   v
BACKEND VALIDATES CART
   |
   v
CHECK PRODUCT STOCK
   |
   v
CALCULATE TOTAL AMOUNT
   |
   v
CREATE ORDER
   |
   v
CREATE ORDER ITEMS
   |
   v
UPDATE PRODUCT STOCK
   |
   v
CLEAR CART
   |
   v
ORDER SUCCESSFULLY PLACED
```

## Database Transactions

Order placement uses a PostgreSQL transaction.

The main operations are:

- Read cart items.
- Check available stock.
- Calculate total amount.
- Insert the order.
- Insert order items.
- Decrease product stock.
- Clear the cart.
- Commit the transaction.

If an operation fails, the transaction is rolled back.

This helps maintain database consistency.

**Note:** The checkout implementation is an order-placement flow; it does not currently integrate a real online payment gateway.

---

# 13. My Orders and Order Tracking

Customers can view their previous orders.

The My Orders section displays:

- Order ID.
- Order date.
- Total amount.
- Current order status.
- Shipping address.

Customers can click Track Order to view order status history.

Order status history is stored in the `order_status_history` table.

The current implementation supports order status management through the Admin Panel.

---

# 14. Admin Dashboard

The Admin Panel provides administrative control over the application.

## Dashboard

Displays:

- Dashboard statistics.
- Recent orders.
- Low-stock products.
- Sales analytics.

## Product Management

Administrators can:

- Add products.
- Edit products.
- Delete products.
- View product inventory.

## Order Management

Administrators can:

- View all orders.
- Check order details.
- Update order status.

## User Management

Administrators can:

- View registered users.
- Update user roles.
- Delete users.

The backend protects administrative endpoints using authentication and authorization middleware.

---

# 15. Password Reset Using OTP

CartWise includes a forgot-password feature.

It uses Nodemailer to send OTP emails.

## Password Reset Workflow

```text
USER FORGOT PASSWORD
        |
        v
ENTER REGISTERED EMAIL
        |
        v
BACKEND GENERATES OTP
        |
        v
OTP HASH STORED IN DATABASE
        |
        v
EMAIL SENT USING NODEMAILER
        |
        v
USER ENTERS OTP
        |
        v
BACKEND VERIFIES OTP
        |
        v
RESET TOKEN GENERATED
        |
        v
USER ENTERS NEW PASSWORD
        |
        v
PASSWORD HASHED USING BCRYPT
        |
        v
PASSWORD UPDATED
```

Security features:

- OTP is stored as a hash.
- OTP has a five-minute expiry.
- OTP verification is required.
- Password is hashed before database storage.

---

# 16. Address Management

Customers can manage shipping addresses.

Available operations:

- Add address.
- View saved addresses.
- Update address.
- Delete address.
- Set a default address.

Each address belongs to a specific user.

The backend uses authentication middleware to prevent users from managing another user's addresses.

---

# 17. REST API Documentation

Base URL:

```text
http://localhost:5000/api
```

## Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/register | Register customer |
| POST | /auth/login | Login |
| PUT | /auth/profile | Update profile |
| POST | /auth/forgot-password | Send OTP |
| POST | /auth/verify-reset-otp | Verify OTP |
| POST | /auth/reset-password | Reset password |

## Product APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /products | Get products |
| GET | /products/categories | Get categories |
| GET | /products/:id | Get product details |
| POST | /products | Add product (Admin) |
| PUT | /products/:id | Update product (Admin) |
| DELETE | /products/:id | Delete product (Admin) |
| GET | /products/admin/low-stock | View low-stock products |
| PATCH | /products/:id/stock | Update stock |

## Cart APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /cart | Add to cart |
| GET | /cart | Get cart |
| DELETE | /cart/:productId | Remove cart item |

## Order APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /orders | Place order |
| GET | /orders | Get customer's orders |
| GET | /orders/:id | Get order details |
| GET | /orders/:id/tracking | Track order |
| PUT | /orders/:id/cancel | Cancel order |
| GET | /orders/admin/all | Get all orders (Admin) |
| PUT | /orders/admin/:id/status | Update order status (Admin) |

## Admin User APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /admin/users | Get all users |
| PUT | /admin/users/:id/role | Update user role |
| DELETE | /admin/users/:id | Delete user |

## Admin Dashboard APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /admin/dashboard/stats | Dashboard statistics |
| GET | /admin/dashboard/recent-orders | Recent orders |
| GET | /admin/dashboard/sales-analytics | Sales analytics |

## Review APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /reviews | Add product review |
| GET | /reviews/:productId | Get product reviews |

## Wishlist APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /wishlist | Add to wishlist |
| GET | /wishlist | Get wishlist |
| DELETE | /wishlist/:productId | Remove from wishlist |

## Address APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /addresses | Add address |
| GET | /addresses | Get addresses |
| PUT | /addresses/:id | Update address |
| DELETE | /addresses/:id | Delete address |

**Note:** Protected APIs require a valid JWT in the Authorization header. Admin-only APIs additionally require administrator authorization.

---

# 18. Installation and Setup

## Prerequisites

Install the following:

- Node.js
- npm
- PostgreSQL
- Git

## Step 1: Clone Repository

```bash
git clone https://github.com/Mrittika666/CartWise.git
```

```bash
cd CartWise
```

## Step 2: Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=cartwise
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432

JWT_SECRET=YOUR_SECRET_KEY

EMAIL_USER=YOUR_EMAIL
EMAIL_APP_PASSWORD=YOUR_EMAIL_APP_PASSWORD

BUSINESS_ID=CARTWISE-ADMIN-2026
```

Never upload the real `.env` file to GitHub.

## Step 3: Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE cartwise;
```

Create the required tables using the project's database schema.

The application requires the tables described in the Database Design section.

## Step 4: Start Backend

Inside the backend folder:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

## Step 5: Frontend Setup

Open another terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

Vite will display the frontend URL, usually:

```text
http://localhost:5173
```

---

# 19. Security Features

CartWise implements several security practices:

1. Password hashing using bcryptjs.
2. JWT-based authentication.
3. Protected backend routes.
4. Role-based authorization.
5. Admin Business ID verification.
6. Parameterized PostgreSQL queries.
7. User-specific cart and order access.
8. User-specific address access.
9. OTP hashing and expiration.
10. Environment variables for sensitive configuration.

---

# 20. Testing and Verification

The following major features have been implemented and tested:

- User registration.
- Customer login.
- Admin login.
- JWT authentication.
- Product listing.
- Product search and filtering.
- Cart operations.
- Wishlist operations.
- Checkout and order creation.
- Order cancellation.
- Order tracking.
- Admin dashboard.
- Admin product management.
- Admin order management.
- Admin user management.
- Address CRUD operations.
- Password reset backend.
- Low-stock inventory APIs.

---

