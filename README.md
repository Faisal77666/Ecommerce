# E-Commerce Platform (MERN)

A full-stack e-commerce web application. It has a React front end, an Express + MongoDB REST API, Stripe payments, image uploads, and a separate Socket.IO service for real-time features.

<!-- [CONFIRM] Add a screenshot or short screen recording of the home page, a product page and checkout. -->

## Features

<!-- [CONFIRM] Keep only what the code actually does. Delete the rest. -->

- User registration and login with hashed passwords and JWT authentication (cookies)
- Product catalog with image uploads (Multer)
- Online payments with Stripe
- Transactional emails with Nodemailer [CONFIRM what it is used for: order confirmation, password reset, etc.]
- Real-time updates over Socket.IO [CONFIRM what it is used for: chat, notifications, order status, etc.]
- [CONFIRM] Cart, orders, admin/seller dashboard, product search and filters

## Tech stack

| Layer     | Tools |
| --------- | ----- |
| Frontend  | React [CONFIRM: build tool and UI libraries from `frontend/package.json`] |
| Backend   | Node.js, Express 5, Mongoose, jsonwebtoken, bcrypt / bcryptjs, cookie-parser, cors, dotenv, Multer, Nodemailer, Stripe |
| Real-time | Socket.IO 4 on a separate Express service |
| Database  | MongoDB |

## Project structure

```
Ecommerce/
├── backend/    # Express API (entry point: backend/server.js)
├── frontend/   # React app
├── socket/     # Socket.IO server (entry point: socket/index.js)
├── uploads/    # Uploaded product images
└── package.json
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local, or a free MongoDB Atlas cluster)
- A Stripe account (test mode keys are enough)
- An SMTP account for sending email [CONFIRM if needed]

### 1. Clone the repo

```bash
git clone https://github.com/Faisal77666/Ecommerce.git
cd Ecommerce
```

### 2. Install dependencies

The backend dependencies live in the root `package.json`. The frontend and socket service each have their own.

```bash
npm install
npm --prefix frontend install
npm --prefix socket install
```

### 3. Configure environment variables

Create a `.env` file in the project root for the backend:

```env
# [CONFIRM] Match these names to the ones used in your backend code.
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
STRIPE_SECRET_KEY=sk_test_...
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file in `socket/` if the service reads one:

```env
# [CONFIRM]
PORT=8900
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file in `frontend/` if it needs the API URL or the Stripe publishable key:

```env
# [CONFIRM] Variable prefix depends on the build tool (REACT_APP_ or VITE_).
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Never commit `.env` files. Use only Stripe test keys while developing.

### 4. Run the app

Open three terminals:

```bash
# Terminal 1: backend API (auto-restarts on changes)
npm run dev

# Terminal 2: frontend
npm run start:frontend

# Terminal 3: socket server
cd socket
npm start
```

For a production-style backend run, use `npm start`.

## Scripts

| Location | Command | What it does |
| -------- | ------- | ------------ |
| root | `npm run dev` | Runs the backend with nodemon |
| root | `npm start` | Runs the backend with Node |
| root | `npm run start:frontend` | Starts the frontend from the root |
| `socket` | `npm start` | Runs the Socket.IO server |

## API endpoints

<!-- [CONFIRM] Replace with the real routes from backend/routes. Example shape: -->

| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| POST | `/api/users/register` | Create an account | No |
| POST | `/api/users/login` | Log in and set the auth cookie | No |
| GET | `/api/products` | List products | No |
| POST | `/api/products` | Create a product with images | Yes |
| POST | `/api/payment/create-checkout-session` | Start a Stripe payment | Yes |

## Author

Faisal Mehmood. [GitHub](https://github.com/Faisal77666) · [Portfolio](https://faisaldev.me)
