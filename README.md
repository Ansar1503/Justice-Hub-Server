# ⚖️ Justice Hub – Backend

## 🚀 Overview

**Justice Hub Backend** is a scalable and modular API system built to power a full-featured legal services platform. It handles authentication, bookings, real-time communication, case management, and financial transactions across multiple roles.

The backend is designed using **Clean Architecture + Domain-Driven Design (DDD)** principles, ensuring maintainability, scalability, and clear separation of concerns.

---

## 🧑‍💻 Supported Roles

* 👤 **Client**
* ⚖️ **Lawyer**
* 🛠 **Admin**

Each role has isolated responsibilities and controlled access through a robust authorization system.

---

## ✨ Core Features

### 🔐 Authentication & Authorization

* JWT-based authentication (Access + Refresh Tokens)
* Role-based access control (RBAC)
* Secure password hashing (bcrypt)
* Middleware-driven route protection

---

### 👤 User & Profile Management

* User registration & login
* Role-based profile extension (Client / Lawyer)
* Profile updates with validation
* Image upload support

---

### 🔍 Lawyer Discovery System

* Advanced filtering (experience, specialization, fees)
* Pagination & optimized querying
* Search functionality with indexing

---

### 📅 Appointment & Booking System

* Dynamic slot management for lawyers
* Real-time availability tracking
* Booking lifecycle (pending → confirmed → completed)
* Cancellation & rescheduling support

---

### 📂 Case Management

* Create and manage legal cases
* Assign lawyers to cases
* Track case progress and updates

---

### 💬 Real-Time Chat System

* Bi-directional messaging
* Attachment support
* Online/offline status tracking
* Session-based controls

---

### 📹 Video Consultation

* Integration-ready video call system
* Secure session handling

---

### ⭐ Reviews & Ratings

* Clients can review lawyers
* Aggregated ratings system

---

### 💰 Wallet & Payments

* Wallet system for clients and lawyers
* Transaction tracking
* Refund and payout handling

---

### 📢 Disputes & Resolution

* Raise disputes on services
* Admin-controlled resolution flow

---

### 📰 Blog Management

* Create, update, and manage blogs
* Content delivery APIs

---

## 🧩 Architecture

The backend follows **Clean Architecture**, separating concerns into layers:

```id="x83k2l"
src/
│── domain/            # Entities & business rules
│── application/       # Use cases (business logic)
│── infrastructure/    # DB, external services
│── interfaces/        # Controllers & routes
│── shared/            # Utilities & common logic
```

### 🧠 Flow (High-Level)

```
Controller → Use Case → Repository → Database
```

* Controllers handle HTTP requests
* Use cases contain business logic
* Repositories abstract database operations
* Infrastructure manages external dependencies

---

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (Access + Refresh Tokens)
* **Validation:** Zod / Custom DTO validation
* **Architecture:** Clean Architecture + DDD
* **File Storage:** AWS S3 (or similar)

---

## ⚙️ Setup Instructions

```bash id="k92jd8"
# Clone the repository
git clone https://github.com/Ansar1503/Justice-Hub-Server

# Navigate into the project
cd Justice-Hub-Backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

---

## 🔐 Environment Variables

```env id="n82kdl"
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
AWS_ACCESS_KEY=your_key
AWS_SECRET_KEY=your_secret
```

---

## 📁 Key Modules

* 🔐 Auth Module
* 👤 User Module
* ⚖️ Lawyer Module
* 📅 Appointment Module
* 💬 Chat Module
* 📂 Case Module
* 💰 Wallet Module
* 📢 Dispute Module
* 📰 Blog Module

---

## 📡 API Design Principles

* RESTful API structure
* Consistent response format
* Centralized error handling
* DTO-based validation
* Status code standardization

---

## 🎯 Highlights

* Scalable and modular architecture
* Strong separation of concerns
* Role-based system design
* Real-time communication support
* Production-ready structure

---

## 🚧 Future Improvements

* 🔔 Real-time notifications (WebSockets)
* 📊 Advanced analytics & reporting
* 🌐 Microservices migration
* 🤖 AI-based lawyer recommendation engine

---

## 🤝 Contributing

Contributions are welcome! Fork the repo and submit a pull request.

---

## 📬 Contact

📧 *muhammedansarma3@gmail.com*

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
t
