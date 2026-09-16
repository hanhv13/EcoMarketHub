# EcoMarketHub

A platform for buying, selling, and renting upcycled, recycled, and used items to promote a circular economy.

## Project structure

- `database/` - MySQL schema and seed data
- `backend/` - Node.js + Express API
- `frontend/` - React (Vite) User Interface

## Quick start (Docker)
1. Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop) is running.
2. Open the terminal at the project root and run:
   ```bash
   docker compose up -d
   ```
3. The database will be seeded automatically. 
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)

## Manual setup

**Requirements:** Node.js v18+ and MySQL 8.0+

### 1. Database
Create a MySQL database named `ecomarkethub`. Import the structure using `database/schema.sql` and seed sample data using `database/clean_database.sql`.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env  # Update DB_PASSWORD to match your local MySQL root password
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Key features

- **Authentication:** Secure JWT-based login and registration (User/Admin roles).
- **Product management:** Post, edit, and delete products for sale or rent with image uploads.
- **Shopping experience:** Search, filter by category, sort, and add items to favorites or cart.
- **Eco-community:** Green points reward system for upcycled purchases and event browsing.
- **Reviews:** Rate and review sellers.

## Default test accounts

- **Admin account:** `hung@example.com` | Password: `admin123`
- **User account:** `user@example.com` | Password: `password123`
