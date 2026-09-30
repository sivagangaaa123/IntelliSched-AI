# 🎓 IntelliSched AI: Project Defense & Viva Guide

This guide is designed to help you prepare for your MCA final year project defense. It breaks down the technical architecture, algorithms, and provides answers to common questions your examiners might ask.

---

## 1. Project Overview & Problem Statement

**The Problem:**
Manual timetable generation in academic departments is an NP-hard problem. It is time-consuming, prone to human error (like double-booking faculty or rooms), and difficult to adjust when unexpected changes occur (e.g., faculty absence). Furthermore, modern AI solutions often act as "black boxes," leaving administrators confused about *why* a certain schedule was generated or why a specific class couldn't be scheduled.

**The Solution:**
**IntelliSched AI** is an Explainable AI-powered timetable optimizer built using the MERN stack. It uses a Constraint Satisfaction Problem (CSP) solver to automate scheduling without clashes, includes a dynamic rescheduler for handling absences, and features an Explainable AI (XAI) inspector that provides human-readable audit trails for all scheduling decisions.

---

## 2. System Architecture (MERN Stack)

Your examiners will want to know your technology stack and why you chose it.

*   **MongoDB (Database):** NoSQL document database. Chosen for its flexibility in handling relational-like data (using `ObjectIds` to link Courses, Faculty, and Classrooms) without the rigid schema constraints of SQL.
*   **Express.js & Node.js (Backend):** JavaScript runtime. Chosen for its asynchronous, non-blocking I/O model which is excellent for handling API requests and running the intensive CSP algorithm.
*   **React 18 + Vite (Frontend):** Modern UI library. Chosen for component-based architecture (reusability) and virtual DOM (fast rendering of complex timetable grids). Vite was used instead of Create React App for significantly faster build times.
*   **Additional Libraries:**
    *   `jsonwebtoken` & `bcryptjs`: For secure authentication.
    *   `recharts`: For interactive data visualization (faculty workload, session distributions).
    *   `framer-motion`: For fluid UI transitions.
    *   `jspdf` & `jspdf-autotable`: For professional PDF report generation.

---

## 3. The Core Algorithm: CSP (Constraint Satisfaction Problem)

This is the heart of your project. Be prepared to explain it in detail.

**How does the CSP Solver work?**
The timetable generation is modeled as a CSP:
1.  **Variables:** The grid slots (Day + Period).
2.  **Domain:** The list of available classes (Course + Faculty + Room + Student Group) that need to be scheduled.
3.  **Algorithm:** Backtracking Search.

**Heuristics Used to Optimize Speed:**
*   **Forward Checking:** When a class is placed, the algorithm immediately checks if future classes still have valid slots. If not, it backtracks early, saving immense computational time.
*   **MRV (Minimum Remaining Values):** The algorithm prioritizes scheduling the "hardest to place" classes first (e.g., Labs that require specific lab rooms or electives with shared student groups).

**Hard Constraints vs. Soft Constraints:**
*   **Hard Constraints (Must be 100% satisfied):** 
    *   No faculty can be in two places at once.
    *   No room can hold two classes at once.
    *   A student group cannot attend two classes at once.
    *   A lab course must be placed in a room type designated as "Lab".
*   **Soft Constraints (Optimized for higher score):**
    *   Distribute classes evenly across the week (avoiding 4 classes on Monday and 0 on Friday).
    *   Minimize massive gaps in a faculty member's daily schedule.

---

## 4. Explainable AI (XAI) & Dynamic Rescheduler

These two features make your project stand out from standard timetable generators.

**Explainable AI (The "Why-Not?" Inspector):**
Instead of just failing to place a class, the engine intercepts the backtracking algorithm's failure points. If a class is rejected from a time slot, the engine logs *exactly* which hard constraint was violated (e.g., "Prof. Smith is already teaching MCA-101 in Room 204 at this time"). The frontend displays this as an audit trail.

**Dynamic Rescheduler:**
When a faculty member is marked absent for a specific day and period, the system performs a **Local Repair**. Instead of regenerating the entire timetable (which would disrupt everyone), it isolates the affected slot, finds an available faculty member and room for that exact time, and patches the schedule while logging the change.

---

## 5. Potential Viva Questions & Answers

### Q1: Why did you use a Constraint Satisfaction Problem (CSP) instead of a Genetic Algorithm (GA)?
**Answer:** While Genetic Algorithms are great for optimization, they are stochastic (randomized) and do not always guarantee that *hard constraints* (like double-booking) will be satisfied 100% of the time, especially in highly constrained environments. CSP is deterministic. If a valid schedule exists, CSP will find it without violating a single hard constraint. Furthermore, CSP makes it mathematically possible to implement the Explainable AI (XAI) audit trail by logging exactly which constraint caused a branch to fail.

### Q2: How is the application secured?
**Answer:** The application uses JWT (JSON Web Tokens) for stateless authentication. When the admin logs in, the Node.js backend verifies the credentials (using `bcrypt` to compare password hashes) and issues a signed JWT. The React frontend stores this token and attaches it to the `Authorization: Bearer` header for all subsequent API requests. The backend uses a custom middleware to protect the timetable generation and rescheduling endpoints.

### Q3: How did you handle the database relationships in MongoDB since it's a NoSQL database?
**Answer:** I used Mongoose's `ObjectId` referencing and `.populate()` methods. For example, a `Course` document stores the `facultyId` and `studentGroupId` as references. When querying the timetable, Mongoose resolves these references to build the full schedule objects, mimicking a relational JOIN but keeping the document structure flexible.

### Q4: What happens if it's impossible to schedule all classes (e.g., not enough rooms)?
**Answer:** The CSP algorithm will attempt all valid branches using Backtracking. If it exhausts all possibilities without finding a 100% clash-free solution, it will halt and return the best partial schedule it found, along with an XAI log detailing exactly which courses could not be scheduled and the specific bottleneck (e.g., "Room capacity exhausted for Labs").

### Q5: Can the application be used for other departments, not just MCA?
**Answer:** Yes. The underlying engine is entirely data-driven. The algorithms look at abstract `Courses`, `Faculty`, and `Classrooms`. By clearing the database and uploading data for an MBA or B.Tech department, the system will generate a valid timetable for them without any code changes.

### Q6: How does the PDF generation work on the frontend?
**Answer:** I utilized `jsPDF` along with the `jspdf-autotable` plugin. When the user clicks download, the utility parses the active JSON timetable grid in React state, maps the course types to a color palette, and programmatically draws the grid, headers, and XAI metrics onto an A4 landscape canvas directly in the browser, without needing a server trip.
