# IntelliSched AI

> **IntelliSched AI: An Explainable AI-Powered Department Timetable Optimizer with Dynamic Rescheduling and Constraint-Based Scheduling for MCA Department**

---

## 📌 Project Overview
IntelliSched AI is an academic project developed for the MCA Department. In most academic institutions, timetable preparation is performed manually—a tedious, error-prone trial-and-error process prone to faculty clashes, room-capacity conflicts, and suboptimal class distributions.

IntelliSched AI automates timetable preparation using **Constraint Satisfaction Problem (CSP)** techniques, featuring:
- **Zero-Conflict Timetable Generation**: Strictly satisfies all hard constraints (faculty clashes, room double-booking, group overlap, room capacities, availability).
- **Soft Constraint Optimization**: Minimizes faculty and student idle gaps, balances daily course loads, and respects faculty time preferences.
- **Explainable AI (XAI)**: Provides plain-English explanations for why a schedule is valid, why a particular slot was chosen, or why a slot could not be assigned.
- **Dynamic Rescheduling**: Performs localized constraint repair when unforeseen events occur (e.g., faculty absence, room maintenance) without recalculating the entire timetable.

---

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Bootstrap 5, Axios, React Router Dom
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Scheduling Intelligence**: Algorithmic CSP Engine (Backtracking + Forward Checking + MRV Heuristic)

---

## 🏛️ Project Architecture
```text
React Frontend
      │
      ▼
Node.js + Express Backend
      │
      ├───────► MongoDB (Data Layer)
      │
      ▼
CSP Scheduling & Explainability Engine
      │
      ▼
Optimized Timetable & XAI Audit Logs
      │
      ▼
React Frontend
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (Local instance or MongoDB Atlas URI)

### Quick Setup

#### 1. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

#### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 📁 Project Structure
```text
PROJECT/
├── client/          # React + Vite Frontend
├── server/          # Node.js + Express Backend & CSP Engine
├── .gitignore       # Git ignore rules
└── README.md        # Project documentation
```

---

## 🎯 Current Project Status
- **Phase 1 Completed**: Project setup, React Vite client, Express backend with health API.
- **Phase 2 In Progress**: Database models & Realistic MCA Seed Dataset.
