const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Route Handlers
const facultyRoutes = require('./routes/facultyRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const studentGroupRoutes = require('./routes/studentGroupRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const constraintRoutes = require('./routes/constraintRoutes');
const timetableRoutes = require('./routes/timetableRoutes');

// Models & Seeder
const Faculty = require('./models/Faculty');
const Course = require('./models/Course');
const Classroom = require('./models/Classroom');
const StudentGroup = require('./models/StudentGroup');
const TimeSlot = require('./models/TimeSlot');
const ConstraintConfig = require('./models/ConstraintConfig');
const Timetable = require('./models/Timetable');
const seedDatabase = require('./seed/seed');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and auto-seed if empty
connectDB()
  .then(async () => {
    try {
      const facultyCount = await Faculty.countDocuments();
      if (facultyCount === 0) {
        console.log('🌱 Database is currently empty. Auto-seeding MCA department dataset...');
        await seedDatabase(false); // false = do not close connection
      }
    } catch (err) {
      console.warn('⚠️  Auto-seed check note:', err.message);
    }
  })
  .catch((err) => {
    console.error('Database connection error on boot:', err.message);
  });

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to IntelliSched AI API Server',
    project: 'IntelliSched AI - MCA Timetable Optimizer',
    version: '1.0.0',
    phase: 'Phase 2: Database Models & Realistic MCA Seed Dataset',
    status: 'online'
  });
});

// Enhanced System Health Check
app.get('/api/health', async (req, res) => {
  try {
    const counts = {
      faculty: await Faculty.countDocuments().catch(() => 0),
      courses: await Course.countDocuments().catch(() => 0),
      classrooms: await Classroom.countDocuments().catch(() => 0),
      studentGroups: await StudentGroup.countDocuments().catch(() => 0),
      timeSlots: await TimeSlot.countDocuments().catch(() => 0),
      timetables: await Timetable.countDocuments().catch(() => 0)
    };

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'IntelliSched-API',
      database: {
        connected: true,
        recordCounts: counts
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      service: 'IntelliSched-API',
      database: {
        connected: false,
        error: err.message
      }
    });
  }
});

// API Routes
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/student-groups', studentGroupRoutes);
app.use('/api/time-slots', timeSlotRoutes);
app.use('/api/constraints', constraintRoutes);
app.use('/api/timetable', timetableRoutes);

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 IntelliSched AI Backend Server running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
