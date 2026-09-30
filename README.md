# 🎓 IntelliSched AI

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-In--Memory-47A248?logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-green.svg)

An **Explainable AI-powered Timetable Optimizer** designed specifically for Academic Departments (MCA/B.Tech). This system solves the NP-hard problem of academic scheduling using a robust **Constraint Satisfaction Problem (CSP)** engine built on the MERN stack.

## ✨ Key Features

- 🧠 **AI-Powered CSP Engine**: Automatically generates 100% clash-free schedules prioritizing Labs, Electives, and Theory courses using Backtracking with MRV heuristics.
- 💬 **Explainable AI (XAI)**: Includes a "Why-Not?" Inspector that provides human-readable audit logs explaining exactly *why* a particular course couldn't be scheduled at a specific time.
- ⚡ **Dynamic Rescheduler**: If a faculty member is absent, the system performs a localized repair (patching only the affected slot) without destroying the rest of the schedule.
- 🔒 **Secure Role-Based Access**: JWT-secured login system (`admin@mca.edu` / `admin`).
- 📊 **Visual Analytics Dashboard**: Interactive charts (Recharts) mapping session distribution and faculty workloads.
- 📄 **Professional PDF Export**: One-click generation of professional, color-coded timetable PDFs complete with metric summaries and XAI audits using `jsPDF`.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Bootstrap 5, Framer Motion (Animations), Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (with `mongodb-memory-server` for seamless zero-setup testing).
- **Core Algorithm**: Backtracking Constraint Satisfaction Problem (CSP) + Local Search Repair.

## 🚀 Quick Start Guide

No local database setup is required! The app uses an in-memory MongoDB that automatically seeds a realistic MCA department dataset on the first boot.

### 1. Clone the repository
```bash
git clone https://github.com/sivagangaaa123/IntelliSched-AI.git
cd IntelliSched-AI
```

### 2. Start the Backend Server
```bash
cd server
npm install
npm start
```
*(The backend will run on `http://localhost:5000`. On first boot, it will auto-seed 10 Faculty, 14 Courses, 7 Rooms, and 5 Student Groups).*

### 3. Start the Frontend Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
*(The frontend will run on `http://localhost:5173`)*

### 4. Default Credentials
- **Email**: `admin@mca.edu`
- **Password**: `admin`

## 🧪 Running Tests
The backend includes a comprehensive 33-suite automated test testing the CSP engine, Rescheduler, XAI audits, and Seed integrity.
```bash
cd server
npm test
```

## 📚 Documentation
For students preparing for a project defense or viva, check out the [Viva & Project Defense Guide](docs/VIVA_DEFENSE_GUIDE.md).

---
*Developed as an MCA Final Year Project emphasizing algorithmic optimization and Explainable AI.*
