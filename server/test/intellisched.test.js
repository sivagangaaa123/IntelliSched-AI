/**
 * IntelliSched AI — Automated Verification Test Suite
 * ====================================================
 * Runs entirely against an in-memory MongoDB instance.
 *
 * Tests:
 *  1. Database seeding (correct counts)
 *  2. CSP Solver produces a valid timetable
 *     a. All 46 sessions are placed
 *     b. Zero hard-constraint violations
 *     c. Room-type compatibility (Lab courses → Computer Lab rooms)
 *     d. No faculty double-booking
 *     e. No classroom double-booking
 *     f. No student-group double-booking
 *  3. Dynamic Rescheduler repairs faculty absence correctly
 *  4. Explainability engine returns meaningful rationale
 *
 * Usage:  node test/intellisched.test.js
 */

const { connectDB, disconnectDB } = require('../src/config/db');
const seedDatabase = require('../src/seed/seed');

// Models
const Faculty = require('../src/models/Faculty');
const Course = require('../src/models/Course');
const Classroom = require('../src/models/Classroom');
const StudentGroup = require('../src/models/StudentGroup');
const TimeSlot = require('../src/models/TimeSlot');
const ConstraintConfig = require('../src/models/ConstraintConfig');

// Engine
const CSPSolver = require('../src/engine/cspSolver');
const DynamicRescheduler = require('../src/engine/rescheduler');
const { explainSlotRejection } = require('../src/engine/explainability');
const { validateHardConstraints } = require('../src/engine/constraints');

// ─── Helpers ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅  ${testName}`);
    passed++;
  } else {
    console.log(`  ❌  ${testName}`);
    failed++;
    failures.push(testName);
  }
}

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    console.log(`  ✅  ${testName}  (${actual})`);
    passed++;
  } else {
    console.log(`  ❌  ${testName}  — expected ${expected}, got ${actual}`);
    failed++;
    failures.push(testName);
  }
}

function assertGte(actual, minimum, testName) {
  if (actual >= minimum) {
    console.log(`  ✅  ${testName}  (${actual} ≥ ${minimum})`);
    passed++;
  } else {
    console.log(`  ❌  ${testName}  — expected ≥ ${minimum}, got ${actual}`);
    failed++;
    failures.push(testName);
  }
}

// ─── Main Test Runner ──────────────────────────────────────────────────────────

async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║   IntelliSched AI — Automated Verification Test Suite   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // ── Connect & Seed ──────────────────────────────────────────────────────────
  console.log('⏳ Connecting to in-memory MongoDB...');
  // Force in-memory by using a non-reachable URI
  process.env.MONGO_URI = 'mongodb://127.0.0.1:1/test_intellisched';
  await connectDB();

  console.log('⏳ Seeding database...\n');
  await seedDatabase(false); // false = don't close connection

  // ── TEST GROUP 1: Seed Data Verification ────────────────────────────────────
  console.log('━━━ TEST 1: Database Seed Verification ━━━');

  const facultyCount = await Faculty.countDocuments();
  const courseCount = await Course.countDocuments();
  const classroomCount = await Classroom.countDocuments();
  const groupCount = await StudentGroup.countDocuments();
  const slotCount = await TimeSlot.countDocuments();
  const configCount = await ConstraintConfig.countDocuments();

  assertEqual(facultyCount, 10, 'Faculty count = 10');
  assertEqual(courseCount, 14, 'Course count = 14');
  assertEqual(classroomCount, 7, 'Classroom count = 7');
  assertEqual(groupCount, 5, 'Student Group count = 5');
  assertEqual(slotCount, 30, 'Time Slot count = 30');
  assertEqual(configCount, 1, 'Constraint Config count = 1');

  // ── Load all data for engine tests ──────────────────────────────────────────
  const courses = await Course.find().populate('faculty').populate('studentGroup');
  const classrooms = await Classroom.find();
  const timeSlots = await TimeSlot.find();
  const facultyList = await Faculty.find();
  const studentGroups = await StudentGroup.find();
  const config = await ConstraintConfig.findOne();

  // Count expected total sessions
  const expectedSessions = courses.reduce((sum, c) => sum + c.weeklyPeriods, 0);

  // ── TEST GROUP 2: CSP Solver ────────────────────────────────────────────────
  console.log('\n━━━ TEST 2: CSP Solver Verification ━━━');

  const solver = new CSPSolver({
    courses,
    classrooms,
    timeSlots,
    facultyList,
    studentGroups,
    config
  });

  const result = solver.solve();

  assert(result.success === true, 'CSP Solver returns success=true');
  assertEqual(result.grid.length, expectedSessions, `All ${expectedSessions} sessions are placed`);
  assertGte(result.metrics.softScore, 0, 'Soft score ≥ 0');
  assertEqual(result.metrics.hardViolationsCount, 0, 'Hard violations count = 0');

  // 2a. Verify zero hard violations by re-checking every entry
  console.log('\n  ── 2a: Re-validate every entry against hard constraints ──');
  let hardViolations = 0;
  const facultyMap = new Map(facultyList.map(f => [f._id.toString(), f]));
  const classroomMap = new Map(classrooms.map(c => [c._id.toString(), c]));
  const groupMap = new Map(studentGroups.map(g => [g._id.toString(), g]));
  const courseMap = new Map(courses.map(c => [c._id.toString(), c]));

  result.grid.forEach((entry, idx) => {
    const course = courseMap.get(entry.course.toString());
    const faculty = facultyMap.get(entry.faculty.toString());
    const classroom = classroomMap.get(entry.classroom.toString());
    const studentGroup = groupMap.get(entry.studentGroup.toString());
    const timeSlot = { day: entry.day, period: entry.period };

    // Build schedule without current entry for clash checking
    const otherEntries = result.grid.filter((_, i) => i !== idx);

    const check = validateHardConstraints({
      course,
      faculty,
      studentGroup,
      classroom,
      timeSlot,
      currentSchedule: otherEntries
    });

    if (!check.valid) {
      hardViolations++;
      console.log(`    ⚠️  Violation at ${entry.day} P${entry.period}: ${check.reason}`);
    }
  });

  assertEqual(hardViolations, 0, 'Independent re-validation: 0 hard violations');

  // 2b. Room Type Compatibility
  console.log('\n  ── 2b: Room Type Compatibility ──');
  let roomTypeMismatches = 0;
  result.grid.forEach(entry => {
    const course = courseMap.get(entry.course.toString());
    const classroom = classroomMap.get(entry.classroom.toString());

    if (course && classroom) {
      if (course.requiredRoomType === 'Computer Lab' && classroom.type !== 'Computer Lab') {
        roomTypeMismatches++;
        console.log(`    ⚠️  ${course.name} needs Computer Lab but got ${classroom.type} (${classroom.name})`);
      }
    }
  });
  assertEqual(roomTypeMismatches, 0, 'Lab courses assigned to Computer Lab rooms');

  // 2c. No Faculty Double-Booking
  console.log('\n  ── 2c: Faculty Double-Booking Check ──');
  let facultyClashes = 0;
  const facultySlotSet = new Set();
  result.grid.forEach(entry => {
    const key = `${entry.faculty.toString()}-${entry.day}-${entry.period}`;
    if (facultySlotSet.has(key)) {
      facultyClashes++;
      console.log(`    ⚠️  Faculty double-booked: ${key}`);
    }
    facultySlotSet.add(key);
  });
  assertEqual(facultyClashes, 0, 'No faculty double-bookings');

  // 2d. No Classroom Double-Booking
  console.log('\n  ── 2d: Classroom Double-Booking Check ──');
  let classroomClashes = 0;
  const classroomSlotSet = new Set();
  result.grid.forEach(entry => {
    const key = `${entry.classroom.toString()}-${entry.day}-${entry.period}`;
    if (classroomSlotSet.has(key)) {
      classroomClashes++;
      console.log(`    ⚠️  Classroom double-booked: ${key}`);
    }
    classroomSlotSet.add(key);
  });
  assertEqual(classroomClashes, 0, 'No classroom double-bookings');

  // 2e. No Student-Group Double-Booking (except valid parallel electives)
  console.log('\n  ── 2e: Student-Group Double-Booking Check ──');
  let groupClashes = 0;
  const groupSlotMap = new Map(); // key = "groupId-day-period" → course info
  result.grid.forEach(entry => {
    const group = groupMap.get(entry.studentGroup.toString());
    const key = `${entry.studentGroup.toString()}-${entry.day}-${entry.period}`;

    if (groupSlotMap.has(key)) {
      // Check if both are elective sub-groups of the same parent (valid parallel)
      const prevEntry = groupSlotMap.get(key);
      const prevGroup = groupMap.get(prevEntry.studentGroup.toString());
      const bothElective = group && group.isElectiveGroup && prevGroup && prevGroup.isElectiveGroup;
      const sameParent = bothElective &&
        group.parentGroupId && prevGroup.parentGroupId &&
        group.parentGroupId.toString() === prevGroup.parentGroupId.toString();

      if (!sameParent) {
        groupClashes++;
        console.log(`    ⚠️  Group double-booked: ${group ? group.name : entry.studentGroup} on ${entry.day} P${entry.period}`);
      }
    }
    groupSlotMap.set(key, entry);
  });
  assertEqual(groupClashes, 0, 'No student-group double-bookings (elective parallels allowed)');

  // ── TEST GROUP 3: Dynamic Rescheduler ───────────────────────────────────────
  console.log('\n━━━ TEST 3: Dynamic Rescheduler Verification ━━━');

  // Find a faculty member who has at least one class in the generated timetable
  const firstEntry = result.grid[0];
  const targetFaculty = facultyMap.get(firstEntry.faculty.toString());

  assert(targetFaculty !== undefined, 'Target faculty for rescheduling found');

  // The DynamicRescheduler expects grid entries with populated course objects
  // (matching the API route which uses populateTimetable). Enrich the raw
  // CSP grid so that entry.course is the full document with .requiredRoomType, .name, etc.
  const enrichedGrid = result.grid.map(entry => ({
    ...entry,
    course: courseMap.get(entry.course.toString()) || entry.course
  }));

  const rescheduler = new DynamicRescheduler({
    timetable: { grid: enrichedGrid },
    classrooms,
    timeSlots,
    facultyList,
    studentGroups
  });

  const rescheduleResult = rescheduler.rescheduleFacultyAbsence({
    facultyId: targetFaculty._id,
    day: firstEntry.day,
    period: firstEntry.period,
    reason: 'Test: Faculty medical leave'
  });

  assert(rescheduleResult.success === true, 'Rescheduler returns success=true');
  assert(rescheduleResult.modified === true, 'Rescheduler modified the timetable');
  assertGte(rescheduleResult.auditLogs.length, 1, 'Audit log has ≥ 1 entry');

  // Verify audit log structure
  const log = rescheduleResult.auditLogs[0];
  assert(log.changeType === 'Dynamic Reschedule', 'Audit log has correct changeType');
  assert(typeof log.justification === 'string' && log.justification.length > 10, 'Audit log has meaningful justification');
  assert(typeof log.originalSlot === 'string', 'Audit log contains original slot info');
  assert(typeof log.newSlot === 'string', 'Audit log contains new slot info');

  // Verify the rescheduled grid has no faculty at the absent slot
  const conflictingEntry = rescheduleResult.grid.find(e =>
    (e.faculty._id || e.faculty).toString() === targetFaculty._id.toString() &&
    e.day === firstEntry.day &&
    e.period === firstEntry.period
  );
  assert(!conflictingEntry, 'Faculty is no longer scheduled at the absent slot after repair');

  // ── TEST GROUP 4: Explainability Engine ─────────────────────────────────────
  console.log('\n━━━ TEST 4: Explainability Engine Verification ━━━');

  // Find a faculty with unavailable slots for testing slot rejection
  const facultyWithLeave = facultyList.find(f =>
    f.unavailableSlots && f.unavailableSlots.length > 0
  );

  if (facultyWithLeave) {
    const unavailSlot = facultyWithLeave.unavailableSlots[0];
    const course0 = courses.find(c =>
      c.faculty._id.toString() === facultyWithLeave._id.toString()
    );

    if (course0) {
      // Pick a classroom that matches the course's required room type
      const suitableRoom = classrooms.find(c =>
        course0.requiredRoomType ? c.type === course0.requiredRoomType : c.type === 'Classroom'
      ) || classrooms[0];

      const rejection = explainSlotRejection({
        course: course0,
        faculty: facultyWithLeave,
        studentGroup: course0.studentGroup,
        classroom: suitableRoom,
        timeSlot: { day: unavailSlot.day, period: unavailSlot.period },
        currentSchedule: result.grid
      });

      assert(typeof rejection === 'object' && rejection !== null, 'explainSlotRejection returns an object');
      assert(rejection.canSchedule === false, 'Slot correctly marked as unschedulable');
      assert(rejection.constraintViolated === 'facultyAvailability',
        'Rejection correctly identifies faculty unavailability constraint');
      assert(typeof rejection.explanation === 'string' && rejection.explanation.length > 10,
        'Rejection includes meaningful explanation text');
    } else {
      console.log('  ⏭️  Skipped: No course for faculty with leave');
    }
  } else {
    console.log('  ⏭️  Skipped: No faculty with unavailable slots found');
  }

  // Check that the generated explanation has content
  assert(result.explanation !== undefined, 'CSP result includes explanation object');
  if (result.explanation) {
    assert(typeof result.explanation.summary === 'string' && result.explanation.summary.length > 20,
      'Explanation has meaningful summary text');
    assert(Array.isArray(result.explanation.decisions) && result.explanation.decisions.length > 0,
      'Explanation includes decision rationales');
  }

  // ── TEST GROUP 5: Solver Performance ────────────────────────────────────────
  console.log('\n━━━ TEST 5: Performance Benchmarks ━━━');
  assert(result.stats.durationMs < 10000, `Solver completed in ${result.stats.durationMs}ms (< 10s limit)`);
  assertGte(result.metrics.softScore, 50, `Soft optimization score is acceptable (${result.metrics.softScore}/100)`);

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log(`║   RESULTS:  ${passed} passed,  ${failed} failed                       `);
  console.log('╚══════════════════════════════════════════════════════════╝');

  if (failed > 0) {
    console.log('\n❌ Failed tests:');
    failures.forEach(f => console.log(`   • ${f}`));
  } else {
    console.log('\n🎉 All tests passed! IntelliSched AI is verified.\n');
  }

  // Clean up
  await disconnectDB();
  process.exit(failed > 0 ? 1 : 0);
}

// Run
runTests().catch(err => {
  console.error('💥 Test runner crashed:', err);
  process.exit(1);
});
