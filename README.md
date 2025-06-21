# 🍽️ Foodies

**Foodies** is a full-stack web application built with the **MERN stack**, enabling users to browse, order, and manage food deliveries. It features JWT authentication, admin dashboard, and category-based browsing for a smooth and modern food ordering experience.

---

## ✨ Features

### 👤 User Features

- 🔐 Register & Login (JWT + Passport)
- 🍱 Browse food by categories (Salad, Rolls, Dessert, Sandwich, Cake, Pure Veg, Pasta, Noodles)
- 📦 Add items to cart and checkout
- 🧾 View order history

### 🧑‍💼 Admin Features

- 📦 CRUD food products
- 📋 Manage user orders
- 📊 View dashboard statistics (orders, revenue)

---

## 🛠️ Technology

| Layer         | Technologies                                                                                      |
|---------------|--------------------------------------------------------------------------------------------------|
| **Frontend**  | React 18 • Vite • React Router DOM 6 • Redux Toolkit • Redux Persist • Axios • SweetAlert2 • Bootstrap 5 |
| **Backend**   | Node.js + Express • MongoDB + Mongoose • JWT • Passport (Local + Google OAuth) • CASL (Role-based Access) • Multer |
| **Dev Tools** | ESLint • Vite Preview

## 🚀 Quick Start

### 1. Clone the repository

- https://github.com/rezza66/ElectroMart.git
- cd ElectroMart

### 3. Run the backend

backend

- cd studi-kasus-backend
- npm install 
- npm run dev

frontend

- cd studi-kasus-frontend
- npm install
- npm run dev

📦 Note: Backend uses nodemon for development. Make sure it is installed globally or locally.

## ⚙️ Environment Variables

Create a .env file in the backend folder as follows:

- PORT=5003
- MONGO_URI=your_mongo_uri
- SESSION_SECRET=your_session_secret
- JWT_SECRET=your_jwt_secret

Create a .env file in the frontend folder as follows:
- VITE_BASE_URL=your_vite_base_url
