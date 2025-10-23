# Rental Inventory - Node.js + Express Backend (MongoDB)

This backend mirrors the mockApi used by the React frontend you provided.

## Features
- Users (register/login) with JWT auth
- Items (CRUD)
- Customers (CRUD)
- Rentals (create, list, return)
- Settings (get/save)

## Setup
1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:
   ```
   npm install
   ```
3. Run (development):
   ```
   npm run dev
   ```
4. API base: `http://localhost:5000/api/`
