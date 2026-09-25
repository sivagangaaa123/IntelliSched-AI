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
- **Frontend**: React (Vite), Bootstrap 5, Bootstrap Icons, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose ODM) with automatic in-memory fallback for offline viva demonstrations
- **Scheduling Intelligence**: Algorithmic CSP Engine (Backtracking + Forward Checking + MRV Heuristic)

---

## 🏛️ Project Architecture
```text
React Frontend (Timetable Grid & Department Tables)
      │
      ▼
Node.js + Express Backend
      │
      ├───────► MongoDB (Data Layer: Faculty, Courses, Rooms, Groups, Constraints)
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
- MongoDB (Optional: The application automatically connects to local MongoDB or MongoDB Atlas URI from `.env`, with an automatic offline fallback for instant academic presentation!)

### Quick Setup

#### 1. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run seed     # (Optional: Server auto-seeds on first boot!)
npm run dev
```

#### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 📡 REST API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System status, database health & collection counts |
| `GET` | `/api/faculty` | List all 10 MCA faculty members with leave constraints |
| `GET` | `/api/courses` | List all 14 MCA courses (Theory, Labs, Electives, Seminar) |
| `GET` | `/api/classrooms` | List all 7 classrooms & labs with seating capacity |
| `GET` | `/api/student-groups` | List all student batches & elective sub-groups |
| `GET` | `/api/time-slots` | List all 30 academic timetable periods (5 days $\times$ 6 periods) |
| `GET` | `/api/constraints` | Get active Hard & Soft constraint rules |
| `GET` | `/api/timetable/active` | Fetch current active timetable grid with populated entities |
| `POST` | `/api/timetable/generate` | Solve CSP and generate zero-clash timetable |
| `POST` | `/api/timetable/reschedule` | Dynamically repair schedule on faculty absence with XAI log |
| `POST` | `/api/timetable/explain-slot`| "Why-Not" conflict diagnostician explaining slot validity |

---

## 📁 Project Structure
```text
PROJECT/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, TimetableGrid, DataTables, RescheduleModal, ExplainSlotModal
│   │   ├── App.jsx             # Main Application Controller
│   │   ├── index.css           # Academic Theme & Custom Badges
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express Backend & CSP Engine
│   ├── src/
│   │   ├── config/             # Database connection & fallback
│   │   ├── engine/             # CSP Solver, Constraints & Explainability
│   │   │   ├── cspSolver.js    # Backtracking + Forward Checking + MRV Heuristic
│   │   │   ├── constraints.js  # Hard and Soft constraint validators
│   │   │   ├── explainability.js # Plain-English decision rationale generator
│   │   │   └── rescheduler.js  # Dynamic timetable repair logic
│   │   ├── models/             # Mongoose Schemas (Faculty, Course, Classroom, Group, TimeSlot, Timetable)
│   │   ├── routes/             # REST API Routes
│   │   ├── seed/               # Realistic MCA Department Seed Dataset
│   │   └── server.js           # Express App Entry Point
│   └── package.json
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🎯 Current Project Status
- ✅ **Phase 1 Completed**: Project setup, React Vite client, Express backend with health API.
- ✅ **Phase 2 Completed**: Mongoose models, realistic MCA seed dataset, department CRUD APIs.
- ✅ **Core Timetable Tasks Completed**:
  - Algorithmic CSP Engine (Backtracking, Forward Checking, MRV).
  - Explainable AI (XAI) rationale generator.
  - Dynamic Rescheduling on unexpected faculty absence.
  - Interactive React Timetable Grid (filterable by Semester, Group, Faculty, Room).
  - Department Data Tables viewer.
  - "Why-Not" Constraint Diagnostic Inspector.
