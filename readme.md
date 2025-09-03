# 📦 Inventory Management System

A full-stack inventory management solution for electronics, designed to track, organize, and manage stock efficiently.  
Built using **Next.js (frontend)**, **Express + MongoDB (backend)**, and **Docker** for containerization, with CI/CD pipelines powered by **GitHub Actions**.

---

## ✨ Features

- 🔐 **User Authentication** (Admin & Staff roles)  
- 📦 **Inventory CRUD** – add, edit, delete, search items  
- 📊 **Dashboard & Analytics** – stock status, low-stock alerts  
- 📝 **API Documentation** with Swagger (OpenAPI)  
- 🧪 **Unit & Integration Testing** with Jest + Supertest  
- 🚀 **CI/CD Pipelines** – automated builds & tests via GitHub Actions  
- 🐳 **Dockerized Deployment** – run frontend, backend & DB with one command  

---

## 🏗️ Tech Stack

### Frontend
- [Next.js 14](https://nextjs.org/) + [Turbopack](https://turbo.build/pack)  
- [Tailwind CSS](https://tailwindcss.com/)  
- ESLint + Prettier  

### Backend
- [Express.js](https://expressjs.com/)  
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)  
- Swagger (API Docs)  
- Jest + Supertest (Testing)  

### DevOps
- Docker + Docker Compose  
- GitHub Actions (CI/CD)  

---

## 📂 Project Structure

inventory-system/
├── frontend/ # Next.js frontend
├── backend/ # Express + MongoDB backend
│ ├── controllers/ # Business logic
│ ├── middleware/ # Auth, error handling
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API endpoints
│ ├── utils/ # Helpers
│ └── index.js # Entry point
├── docker/ # Dockerfiles & compose configs
├── .github/workflows/ # CI/CD pipelines
├── docs/ # Documentation (SDLC, diagrams, planning)
└── README.md # Project overview

## 🚀 Getting Started

### 1️⃣ Clone the repository

git clone https://github.com/Badabhai/Inventory_Management_System.git
cd inventory-system

### 2️⃣ Setup Environment Variables
### 3️⃣ Run Backend
### 4️⃣ Run Frontend
### 5️⃣ Run with Docker (Full Stack)

🧪 Running Tests

📖 API Documentation

🛠️ CI/CD Pipeline

📘 Documentation

All planning, diagrams, and SDLC documents are in the /docs folder:
 -planning.md
 -architecture.drawio
 -db-schema.md

🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss changes.

📜 License

This project is licensed under the MIT License.