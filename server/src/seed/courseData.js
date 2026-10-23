const courseData = [
  // =========================================================================
  // --- First Semester MCA (2026 Batch) — Core Academic Curriculum ---
  // =========================================================================
  {
    courseId: '26CAPC7001',
    courseCode: '26CAPC7001',
    name: 'Mathematical Foundations for Computing (MFC)',
    semester: 1,
    weeklyPeriods: 5,
    courseType: 'Theory',
    facultyRef: 'FAC005', // Dr. Rose Mary Mathew (RMM)
    studentGroupRef: 'MCA-S1',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: '26CAPC7002',
    courseCode: '26CAPC7002',
    name: 'Advanced Database Management Systems (ADBMS)',
    semester: 1,
    weeklyPeriods: 5,
    courseType: 'Theory',
    facultyRef: 'FAC003', // Ms. Anju L (AL)
    studentGroupRef: 'MCA-S1',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: '26CAPC7003',
    courseCode: '26CAPC7003',
    name: 'Advanced Python Programming (PYTHON)',
    semester: 1,
    weeklyPeriods: 5,
    courseType: 'Theory',
    facultyRef: 'FAC004', // Ms. Joice T (JT)
    studentGroupRef: 'MCA-S1',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: '26CAPC7004',
    courseCode: '26CAPC7004',
    name: 'Advanced Software Engineering (ASE)',
    semester: 1,
    weeklyPeriods: 5,
    courseType: 'Theory',
    facultyRef: 'FAC006', // Dr. Santhosh Kottam (SK)
    studentGroupRef: 'MCA-S1',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: '26CAPL7001',
    courseCode: '26CAPL7001',
    name: 'Advance DBMS Lab (ADBMS Lab)',
    semester: 1,
    weeklyPeriods: 4,
    courseType: 'Lab',
    facultyRef: 'FAC003', // Ms. Anju L (AL)
    studentGroupRef: 'MCA-S1',
    requiredRoomType: 'Computer Lab'
  },
  {
    courseId: '26CAPL7002',
    courseCode: '26CAPL7002',
    name: 'Python Programming Lab (Python Lab)',
    semester: 1,
    weeklyPeriods: 4,
    courseType: 'Lab',
    facultyRef: 'FAC004', // Ms. Joice T (JT)
    studentGroupRef: 'MCA-S1',
    requiredRoomType: 'Computer Lab'
  },
  {
    courseId: '26CAPL7003',
    courseCode: '26CAPL7003',
    name: 'Advanced Web Programming Lab (Web Lab)',
    semester: 1,
    weeklyPeriods: 4,
    courseType: 'Lab',
    facultyRef: 'FAC005', // Dr. Rose Mary Mathew (RMM)
    studentGroupRef: 'MCA-S1',
    requiredRoomType: 'Computer Lab'
  },

  // =========================================================================
  // --- Third Semester MCA (2025 Batch) — Core Academic Curriculum ---
  // =========================================================================
  {
    courseId: '20MCA201',
    courseCode: '20MCA201',
    name: 'Data Science & Machine Learning (DSML)',
    semester: 3,
    weeklyPeriods: 5,
    courseType: 'Theory',
    facultyRef: 'FAC002', // Ms. Senu Abi (SA)
    studentGroupRef: 'MCA-S3',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: '20MCA203',
    courseCode: '20MCA203',
    name: 'Design & Analysis of Algorithms (DAA)',
    semester: 3,
    weeklyPeriods: 5,
    courseType: 'Theory',
    facultyRef: 'FAC003', // Ms. Anju L (AL)
    studentGroupRef: 'MCA-S3',
    requiredRoomType: 'Classroom'
  },

  // --- Elective Set 1 (Parallel Stream 1: Cloud vs Crypto) ---
  {
    courseId: '20MCA263',
    courseCode: '20MCA263',
    name: 'Cyber Security & Cryptography (CSC)',
    semester: 3,
    weeklyPeriods: 5,
    courseType: 'Elective',
    facultyRef: 'FAC001', // Dr. Shahna K U (SKU)
    studentGroupRef: 'MCA-S3-E1-CSC',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: '20MCA265',
    courseCode: '20MCA265',
    name: 'Cloud Computing (CC)',
    semester: 3,
    weeklyPeriods: 5,
    courseType: 'Elective',
    facultyRef: 'FAC007', // Dr. Rakhi Venugopal (RV)
    studentGroupRef: 'MCA-S3-E1-CC',
    requiredRoomType: 'Classroom'
  },

  // --- Elective Set 2 (Parallel Stream 2: Deep Learning vs IoT) ---
  {
    courseId: '20MCA281',
    courseCode: '20MCA281',
    name: 'Internet of Things (IoT)',
    semester: 3,
    weeklyPeriods: 5,
    courseType: 'Elective',
    facultyRef: 'FAC004', // Ms. Joice T (JT)
    studentGroupRef: 'MCA-S3-E2-IOT',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: '20MCA283',
    courseCode: '20MCA283',
    name: 'Deep Learning (DL)',
    semester: 3,
    weeklyPeriods: 5,
    courseType: 'Elective',
    facultyRef: 'FAC008', // Ms. Sona Mary Louis (SML)
    studentGroupRef: 'MCA-S3-E2-DL',
    requiredRoomType: 'Computer Lab'
  },

  // --- Labs & Project ---
  {
    courseId: '20MCA241',
    courseCode: '20MCA241',
    name: 'Data Science Lab (DSc Lab)',
    semester: 3,
    weeklyPeriods: 4,
    courseType: 'Lab',
    facultyRef: 'FAC002', // Ms. Senu Abi (SA)
    studentGroupRef: 'MCA-S3',
    requiredRoomType: 'Computer Lab'
  },
  {
    courseId: '20MCA243',
    courseCode: '20MCA243',
    name: 'Mobile Application Development Lab (MAD Lab)',
    semester: 3,
    weeklyPeriods: 4,
    courseType: 'Lab',
    facultyRef: 'FAC009', // Dr. Sujesh P Lal (SPL)
    studentGroupRef: 'MCA-S3',
    requiredRoomType: 'Computer Lab'
  },
  {
    courseId: '20MCA245',
    courseCode: '20MCA245',
    name: 'Mini Project',
    semester: 3,
    weeklyPeriods: 4,
    courseType: 'Lab',
    facultyRef: 'FAC010', // Dr. Deepa Mary Mathews (DMM)
    studentGroupRef: 'MCA-S3',
    requiredRoomType: 'Computer Lab'
  }
];

module.exports = courseData;
