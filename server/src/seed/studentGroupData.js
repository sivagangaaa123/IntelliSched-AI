const studentGroupData = [
  {
    groupId: 'MCA-S1-A',
    name: 'MCA Semester 1',
    semester: 1,
    studentCount: 60,
    program: 'MCA',
    isElectiveGroup: false
  },
  {
    groupId: 'MCA-S3-A',
    name: 'MCA Semester 3 (Section A)',
    semester: 3,
    studentCount: 60,
    program: 'MCA',
    isElectiveGroup: false
  },
  {
    groupId: 'MCA-S3-B',
    name: 'MCA Semester 3 (Section B)',
    semester: 3,
    studentCount: 50,
    program: 'MCA',
    isElectiveGroup: false
  },
  // Elective Sub-groups (for Semester 3 Section A)
  {
    groupId: 'MCA-S3-A-E1',
    name: 'MCA S3-A Elective 1 (Machine Learning)',
    semester: 3,
    studentCount: 32,
    program: 'MCA',
    isElectiveGroup: true,
    parentGroupRef: 'MCA-S3-A'
  },
  {
    groupId: 'MCA-S3-A-E2',
    name: 'MCA S3-A Elective 2 (Cyber Security)',
    semester: 3,
    studentCount: 28,
    program: 'MCA',
    isElectiveGroup: true,
    parentGroupRef: 'MCA-S3-A'
  }
];

module.exports = studentGroupData;
