# Plan - EcoHubMarket 8-Week Technical Plan

**Project Type:** University Assignment (runs on localhost)
**Time:** 8 Weeks
**Team Size:** 4 Students

## 👥 Team Roles

| Member | Role | Main Tasks |
| :--- | :--- | :--- |
| **Member 1 (Leader)** | **Main Coder** | Setup project, connect Frontend & Backend, fix hard bugs. |
| **Member 2** | **Frontend UI** | Write UI Components, pages, and CSS. |
| **Member 3** | **Backend DB** | Write API Routes, Controllers, Models, and Database connection. |
| **Member 4** | **Support & Test** | Help code simple Routes/Controllers, test API, write README. |

---

## 📅 Weekly Task List

### Week 1: Idea and UI Design
*Goal: Decide the tech stack, features, and draw how the website looks.*

*   **Member 1:** Choose the tools (for example: React for Frontend, Node/Express for Backend).
*   **Member 2:** Draw UI on Figma (Home, Login, Products, Cart).
*   **Member 3:** Design Database tables (Users, Products, Orders) and draw ERD (Entity-Relationship Diagram).
*   **Member 4:** Write the project requirements document (list all features we will build).

### Week 2: Setup Project & Database
*Goal: Create project folders and connect to the database.*

*   **Member 1:** Create `/frontend` and `/backend` folders. Install basic packages (`npm install`). Setup Git.
*   **Member 2:** Code basic Frontend Layout Components (Navbar, Footer, Main Container).
*   **Member 3:** Create Database in localhost (phpMyAdmin). Write `db.js` to connect Backend to Database.
*   **Member 4:** Write SQL `INSERT` statements to add fake mock data. Test if `db.js` connects correctly.

### Week 3: Login & Register (Auth)
*Goal: Allow users to create an account and log in.*

*   **Member 1:** Connect Frontend Login forms with Backend API using `fetch` or `axios`. Save user token in `localStorage`.
*   **Member 2:** Code `Login` Component and `Register` Component.
*   **Member 3:** Write `authRoute.js` and `authController.js` (hash password, generate token).
*   **Member 4:** Write Auth Middleware to check if the user is logged in. Test Login API in Postman.

### Week 4: Products Page (Display Data)
*Goal: Show products from the database on the website.*

*   **Member 1:** Setup global state (React Context or Redux) to manage Product data in Frontend.
*   **Member 2:** Code `ProductCard` Component and `ProductList` Page.
*   **Member 3:** Write `productRoute.js` and API to GET all products and GET one product.
*   **Member 4:** Help Member 2 make the API call in Frontend to show products on the screen.

### Week 5: Product Admin (Manage Data)
*Goal: Allow admins to add, edit, or delete products.*

*   **Member 1:** Setup CORS and fix any API connection errors.
*   **Member 2:** Code Admin UI page (Forms to add new products or edit them).
*   **Member 3:** Write API to ADD, EDIT, and DELETE products.
*   **Member 4:** Test the ADD, EDIT, DELETE APIs in Postman to make sure they work.

### Week 6: Cart & Shopping Logic
*Goal: Let users add products to their shopping cart.*

*   **Member 1:** Code the Shopping Cart logic in Frontend (Add to cart, remove item, calculate total price).
*   **Member 2:** Code `CartItem` Component and the Cart Page UI.
*   **Member 3:** Write API to get cart items (if saving cart to database) or help Member 1 save cart to `localStorage`.
*   **Member 4:** Test the cart to see if the total price is correct when changing item quantity.

### Week 7: Checkout & User Profile
*Goal: Finish buying products and show order history.*

*   **Member 1:** Connect Cart data to the Checkout page.
*   **Member 2:** Code `Checkout` Page UI and `UserProfile` Component.
*   **Member 3:** Write `orderRoute.js` and `orderController.js` to save orders to the database.
*   **Member 4:** Code the API in Backend to get Order History for the User Profile.

### Week 8: Fix Bugs & Final Report
*Goal: Make sure everything works smoothly for the presentation.*

*   **Member 1:** Fix routing bugs and state errors. Make sure the project starts easily on localhost without crashing.
*   **Member 2:** Fix CSS bugs. Add basic hover effects. Make the website look nice.
*   **Member 3:** Remove useless `console.log` in all Controllers and Routes. Clean up the Database tables.
*   **Member 4:** Write the `README.md` file (Step 1: How to import Database, Step 2: How to start Backend, Step 3: How to start Frontend). Prepare the PowerPoint slide.
