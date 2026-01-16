Fullstack CRUD Authentication Application

A full-stack application built with Next.js (Frontend), Node.js + Express (Backend), and MongoDB.
It supports authentication (JWT), protected routes, product CRUD operations, rate limiting, and unit testing with high coverage.

📌 Tech Stack
Frontend

Next.js (App Router)

TypeScript

React

Jest + React Testing Library

Cookie-based authentication

Backend

Node.js 20

Express.js

MongoDB + Mongoose

JWT Authentication

Rate Limiting

Node Clustering

Jest + Supertest

🧩 Project Structure
fullstack-crud-auth/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── app.js
│ │ └── server.js
│ ├── tests/
│ ├── jest.config.js
│ ├── package.json
│ └── .env
│
├── frontend/
│ ├── app/
│ │ ├── login/
│ │ ├── register/
│ │ ├── products/
│ │ └── page.tsx
│ ├── lib/
│ ├── **tests**/
│ ├── jest.config.js
│ ├── package.json
│ └── .env.local
│
└── README.md

✅ Node Version Requirement

This project requires Node.js 20.

Check your version:

node -v

If needed, use nvm:

nvm install 20
nvm use 20

⚙️ Environment Variables
Backend (backend/.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/fullstack-crud
JWT_SECRET=your_secret_key
NODE_ENV=development

Frontend (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000

🚀 Getting Started
1️⃣ Install Dependencies
Backend
cd backend
npm install

Frontend
cd frontend
npm install

▶️ Running the Application
Start Backend Server
cd backend
npm run dev

Backend runs on:

http://localhost:5000

Start Frontend Server
cd frontend
npm run dev

Frontend runs on:

http://localhost:3000

🔐 Authentication Flow

JWT stored in HTTP-only cookies

Protected routes require valid authentication

Middleware prevents unauthorized access

Routes

URL Description
/ Landing page (Login & Register)
/login Login form
/register Register form
/products Protected CRUD page

📦 Backend API Endpoints

Auth Routes

Method Endpoint Description
POST /api/auth/register Register user
POST /api/auth/login Login user
POST /api/auth/logout Logout user

Product Routes

Method Endpoint Description
POST /api/products Create product (Auth)
GET /api/products Get all products
GET /api/products/:id Get product by ID
PUT /api/products/:id Update product (Auth)
DELETE /api/products/:id Delete product (Auth)

✅ Rate limiting enabled on APIs

🧪 Running Tests
Backend Tests
cd backend
npm run test

Uses MongoDB Memory Server

Jest + Supertest

Auth, Products, DB, and Models tested

Frontend Tests
cd frontend
npm run test

Jest + React Testing Library

Component & integration tests

Auth Guard and API mocking

Coverage is shown in terminal output
(Coverage folders are ignored via .gitignore)

📊 Testing Highlights

Edge cases covered:

Invalid credentials

Duplicate users

Missing fields

Invalid product IDs

Deleted product while editing

Missing JWT secret

Frontend router mocked for testing

API calls mocked for isolation

🧠 Features Implemented (As Per Requirement)
✅ Task 1 – Environment Setup

Next.js frontend

Express backend

MongoDB with Mongoose

✅ Task 2 – CRUD Application

Full product CRUD

Rate-limited APIs

Frontend product table with edit/delete

✅ Task 3 – Authentication & Authorization

JWT authentication

Secure cookie storage

Protected routes (backend & frontend)

Auth guard using Next.js middleware

Node clustering support (backend)

🔒 Security Notes

HTTP-only cookies

JWT expiry

Rate limiting

Input validation

Protected routes

📌 Notes

Ensure MongoDB is running locally or update MONGO_URI

Use Node 20 only

Do not commit .env files

Coverage folders are excluded from git

👤 Author

Utkarsh Koshta
Senior Full Stack Developer
