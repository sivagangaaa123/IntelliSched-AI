const studentGroupData = [
  {
    groupId: 'MCA-S1',
    name: 'First Semester MCA (2026 Batch)',
    semester: 1,
    studentCount: 60,
    program: 'MCA',
    isElectiveGroup: false
  },
  {
    groupId: 'MCA-S3',
    name: 'Third Semester MCA (2025 Batch)',
    semester: 3,
    studentCount: 60,
    program: 'MCA',
    isElectiveGroup: false
  },
  // Elective Option 1: Cyber Security & Cryptography vs Cloud Computing
  {
    groupId: 'MCA-S3-E1-CSC',
    name: 'MCA S3 Elective 1 (Cyber Security & Cryptography)',
    semester: 3,
    studentCount: 30,
    program: 'MCA',
    isElectiveGroup: true,
    electiveBucket: 'E1',
    parentGroupRef: 'MCA-S3'
  },
  {
    groupId: 'MCA-S3-E1-CC',
    name: 'MCA S3 Elective 1 (Cloud Computing)',
    semester: 3,
    studentCount: 30,
    program: 'MCA',
    isElectiveGroup: true,
    electiveBucket: 'E1',
    parentGroupRef: 'MCA-S3'
  },
  // Elective Option 2: Internet of Things vs Deep Learning
  {
    groupId: 'MCA-S3-E2-IOT',
    name: 'MCA S3 Elective 2 (Internet of Things)',
    semester: 3,
    studentCount: 30,
    program: 'MCA',
    isElectiveGroup: true,
    electiveBucket: 'E2',
    parentGroupRef: 'MCA-S3'
  },
  {
    groupId: 'MCA-S3-E2-DL',
    name: 'MCA S3 Elective 2 (Deep Learning)',
    semester: 3,
    studentCount: 30,
    program: 'MCA',
    isElectiveGroup: true,
    electiveBucket: 'E2',
    parentGroupRef: 'MCA-S3'
  }
];

module.exports = studentGroupData;
