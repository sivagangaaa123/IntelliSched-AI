const courseData = [
  // --- MCA Semester 3 Section A Core Courses ---
  {
    courseId: 'CRS301',
    courseCode: 'MCA301',
    name: 'Advanced Database Management Systems',
    semester: 3,
    weeklyPeriods: 4,
    courseType: 'Theory',
    facultyRef: 'FAC001',
    studentGroupRef: 'MCA-S3-A',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: 'CRS302',
    courseCode: 'MCA302',
    name: 'Computer Networks & Cloud Computing',
    semester: 3,
    weeklyPeriods: 4,
    courseType: 'Theory',
    facultyRef: 'FAC002',
    studentGroupRef: 'MCA-S3-A',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: 'CRS303',
    courseCode: 'MCA303',
    name: 'Software Engineering & Agile Methodologies',
    semester: 3,
    weeklyPeriods: 3,
    courseType: 'Theory',
    facultyRef: 'FAC003',
    studentGroupRef: 'MCA-S3-A',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: 'CRS304',
    courseCode: 'MCA304',
    name: 'Artificial Intelligence & Machine Learning',
    semester: 3,
    weeklyPeriods: 4,
    courseType: 'Theory',
    facultyRef: 'FAC005',
    studentGroupRef: 'MCA-S3-A',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: 'CRS305',
    courseCode: 'MCA305',
    name: 'Full Stack Web Technologies',
    semester: 3,
    weeklyPeriods: 3,
    courseType: 'Theory',
    facultyRef: 'FAC007',
    studentGroupRef: 'MCA-S3-A',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: 'CRS306',
    courseCode: 'MCA306',
    name: 'DBMS & Cloud Computing Laboratory',
    semester: 3,
    weeklyPeriods: 3,
    courseType: 'Lab',
    facultyRef: 'FAC001',
    studentGroupRef: 'MCA-S3-A',
    requiredRoomType: 'Computer Lab'
  },
  {
    courseId: 'CRS307',
    courseCode: 'MCA307',
    name: 'Web Technologies & AI Laboratory',
    semester: 3,
    weeklyPeriods: 3,
    courseType: 'Lab',
    facultyRef: 'FAC007',
    studentGroupRef: 'MCA-S3-A',
    requiredRoomType: 'Computer Lab'
  },
  {
    courseId: 'CRS308',
    courseCode: 'MCA308',
    name: 'Technical Seminar & Research Methodology',
    semester: 3,
    weeklyPeriods: 2,
    courseType: 'Seminar',
    facultyRef: 'FAC004',
    studentGroupRef: 'MCA-S3-A',
    requiredRoomType: 'Seminar Hall'
  },

  // --- Elective Courses for MCA Semester 3 Section A ---
  {
    courseId: 'CRS309',
    courseCode: 'MCA309-E1',
    name: 'Elective I: Applied Machine Learning',
    semester: 3,
    weeklyPeriods: 3,
    courseType: 'Elective',
    facultyRef: 'FAC005',
    studentGroupRef: 'MCA-S3-A-E1',
    requiredRoomType: 'Computer Lab'
  },
  {
    courseId: 'CRS310',
    courseCode: 'MCA310-E2',
    name: 'Elective I: Information & Cyber Security',
    semester: 3,
    weeklyPeriods: 3,
    courseType: 'Elective',
    facultyRef: 'FAC006',
    studentGroupRef: 'MCA-S3-A-E2',
    requiredRoomType: 'Classroom'
  },

  // --- MCA Semester 1 Courses (Creates realistic inter-semester faculty sharing) ---
  {
    courseId: 'CRS101',
    courseCode: 'MCA101',
    name: 'Mathematical Foundations of Computer Science',
    semester: 1,
    weeklyPeriods: 4,
    courseType: 'Theory',
    facultyRef: 'FAC008',
    studentGroupRef: 'MCA-S1-A',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: 'CRS102',
    courseCode: 'MCA102',
    name: 'Advanced Data Structures & Algorithms',
    semester: 1,
    weeklyPeriods: 4,
    courseType: 'Theory',
    facultyRef: 'FAC004',
    studentGroupRef: 'MCA-S1-A',
    requiredRoomType: 'Classroom'
  },
  {
    courseId: 'CRS103',
    courseCode: 'MCA103',
    name: 'Data Structures in C++ & Python Lab',
    semester: 1,
    weeklyPeriods: 3,
    courseType: 'Lab',
    facultyRef: 'FAC009',
    studentGroupRef: 'MCA-S1-A',
    requiredRoomType: 'Computer Lab'
  },
  {
    courseId: 'CRS104',
    courseCode: 'MCA104',
    name: 'Object Oriented Software Design',
    semester: 1,
    weeklyPeriods: 3,
    courseType: 'Theory',
    facultyRef: 'FAC010',
    studentGroupRef: 'MCA-S1-A',
    requiredRoomType: 'Classroom'
  }
];

module.exports = courseData;
