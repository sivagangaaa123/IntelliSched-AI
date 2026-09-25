const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { connectDB, disconnectDB } = require('../config/db');

// Models
const Faculty = require('../models/Faculty');
const Classroom = require('../models/Classroom');
const StudentGroup = require('../models/StudentGroup');
const Course = require('../models/Course');
const TimeSlot = require('../models/TimeSlot');
const ConstraintConfig = require('../models/ConstraintConfig');

// Data sources
const facultyData = require('./facultyData');
const classroomData = require('./classroomData');
const studentGroupData = require('./studentGroupData');
const courseData = require('./courseData');
const timeSlotData = require('./timeSlotData');
const constraintData = require('./constraintData');

const seedDatabase = async (closeConnection = true) => {
  console.log('=====================================================');
  console.log('🌱 Seeding IntelliSched AI Database (MCA Department)');
  console.log('=====================================================');

  try {
    // Only connect if not already connected (readyState 1 = connected)
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // 1. Clear existing IntelliSched collections safely
    console.log('🧹 Clearing existing department collections...');
    await Promise.all([
      Faculty.deleteMany({}),
      Classroom.deleteMany({}),
      StudentGroup.deleteMany({}),
      Course.deleteMany({}),
      TimeSlot.deleteMany({}),
      ConstraintConfig.deleteMany({})
    ]);

    // 2. Insert Time Slots (30 slots: 5 days x 6 periods)
    const insertedTimeSlots = await TimeSlot.insertMany(timeSlotData);
    console.log(`⏱️  Time Slots created: ${insertedTimeSlots.length}`);

    // 3. Insert Classrooms & Labs
    const insertedClassrooms = await Classroom.insertMany(classroomData);
    console.log(`🏫 Classrooms & Labs created: ${insertedClassrooms.length}`);

    // 4. Insert Student Groups (Handling Parent and Elective Sub-groups)
    const parentGroupsData = studentGroupData.filter(g => !g.isElectiveGroup);
    const insertedParents = await StudentGroup.insertMany(parentGroupsData);

    const groupMap = {};
    insertedParents.forEach(g => {
      groupMap[g.groupId] = g._id;
    });

    const electiveGroupsData = studentGroupData
      .filter(g => g.isElectiveGroup)
      .map(eg => ({
        groupId: eg.groupId,
        name: eg.name,
        semester: eg.semester,
        studentCount: eg.studentCount,
        program: eg.program,
        isElectiveGroup: true,
        parentGroupId: groupMap[eg.parentGroupRef] || null
      }));

    const insertedElectives = await StudentGroup.insertMany(electiveGroupsData);
    insertedElectives.forEach(g => {
      groupMap[g.groupId] = g._id;
    });

    console.log(`👥 Student Groups created: ${insertedParents.length + insertedElectives.length} (including ${insertedElectives.length} elective groups)`);

    // 5. Insert Faculty
    const insertedFaculty = await Faculty.insertMany(facultyData);
    const facultyMap = {};
    insertedFaculty.forEach(f => {
      facultyMap[f.facultyId] = f._id;
    });
    console.log(`👨‍🏫 Faculty members created: ${insertedFaculty.length}`);

    // 6. Insert Courses (Resolving references to Faculty and StudentGroup)
    const coursesToInsert = courseData.map(c => {
      const facultyId = facultyMap[c.facultyRef];
      const studentGroupId = groupMap[c.studentGroupRef];

      if (!facultyId) {
        throw new Error(`Referenced facultyId '${c.facultyRef}' not found for course '${c.courseCode}'`);
      }
      if (!studentGroupId) {
        throw new Error(`Referenced studentGroupId '${c.studentGroupRef}' not found for course '${c.courseCode}'`);
      }

      return {
        courseId: c.courseId,
        courseCode: c.courseCode,
        name: c.name,
        semester: c.semester,
        weeklyPeriods: c.weeklyPeriods,
        courseType: c.courseType,
        faculty: facultyId,
        studentGroup: studentGroupId,
        requiredRoomType: c.requiredRoomType
      };
    });

    const insertedCourses = await Course.insertMany(coursesToInsert);
    console.log(`📚 Courses created: ${insertedCourses.length} (Theory, Labs, Electives, Seminar)`);

    // 7. Insert Constraints Configuration
    const insertedConfig = await ConstraintConfig.create(constraintData);
    console.log(`⚙️  Constraint Configuration initialized: '${insertedConfig.name}'`);

    console.log('=====================================================');
    console.log('✅ Database seeded successfully!');
    console.log(`   • Faculty:        ${insertedFaculty.length}`);
    console.log(`   • Courses:        ${insertedCourses.length}`);
    console.log(`   • Classrooms:     ${insertedClassrooms.length}`);
    console.log(`   • Student Groups: ${insertedParents.length + insertedElectives.length}`);
    console.log(`   • Time Slots:     ${insertedTimeSlots.length}`);
    console.log(`   • Constraints:    Active (7 Hard, 5 Soft)`);
    console.log('=====================================================');

    return true;
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    if (closeConnection) {
      await disconnectDB();
      console.log('🔌 Database connection closed.');
    }
  }
};

// Execute if run directly
if (require.main === module) {
  seedDatabase(true).catch(() => process.exit(1));
}

module.exports = seedDatabase;
