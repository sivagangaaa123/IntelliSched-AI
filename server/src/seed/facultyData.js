const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Helper to generate full default availability (all 6 periods for all 5 days)
const defaultAvailability = () => days.map(day => ({
  day,
  periods: [1, 2, 3, 4, 5, 6]
}));

const facultyData = [
  {
    facultyId: 'FAC001',
    name: 'Dr. Rajesh Kumar',
    department: 'MCA',
    designation: 'Professor',
    email: 'rajesh.kumar@mca.edu',
    maxWeeklyHours: 12,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Monday', period: 1, reason: 'Department HOD Council Meeting' },
      { day: 'Wednesday', period: 4, reason: 'Academic Senate Duty' }
    ],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC002',
    name: 'Dr. Ananya Sharma',
    department: 'MCA',
    designation: 'Associate Professor',
    email: 'ananya.sharma@mca.edu',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Wednesday', period: 3, reason: 'Research & Guidance Hour' }
    ],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC003',
    name: 'Prof. Vikram Nair',
    department: 'MCA',
    designation: 'Associate Professor',
    email: 'vikram.nair@mca.edu',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Tuesday', period: 5, reason: 'Curriculum Revision Meeting' }
    ],
    preferences: { preferredTime: 'afternoon', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC004',
    name: 'Prof. Meera Menon',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'meera.menon@mca.edu',
    maxWeeklyHours: 18,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Thursday', period: 2, reason: 'Lab Inventory & Maintenance' }
    ],
    preferences: { preferredTime: 'any', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC005',
    name: 'Prof. Suresh Pillai',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'suresh.pillai@mca.edu',
    maxWeeklyHours: 18,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Friday', period: 4, reason: 'Student Mentorship Sessions' }
    ],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC006',
    name: 'Dr. Kavitha Sundaram',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'kavitha.sundaram@mca.edu',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Monday', period: 4, reason: 'Project Review Committee' }
    ],
    preferences: { preferredTime: 'afternoon', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC007',
    name: 'Prof. Arun Varma',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'arun.varma@mca.edu',
    maxWeeklyHours: 18,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Wednesday', period: 5, reason: 'Placement & Internship Coordination' }
    ],
    preferences: { preferredTime: 'any', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC008',
    name: 'Prof. Deepa Thomas',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'deepa.thomas@mca.edu',
    maxWeeklyHours: 18,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Tuesday', period: 3, reason: 'Exam Cell Duty' }
    ],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC009',
    name: 'Prof. Harish Mohan',
    department: 'MCA',
    designation: 'Lecturer',
    email: 'harish.mohan@mca.edu',
    maxWeeklyHours: 20,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Thursday', period: 6, reason: 'Department Sports & Activities' }
    ],
    preferences: { preferredTime: 'afternoon', maxConsecutivePeriods: 3 }
  },
  {
    facultyId: 'FAC010',
    name: 'Dr. Pooja Hegde',
    department: 'MCA',
    designation: 'Guest Faculty',
    email: 'pooja.hegde@mca.edu',
    maxWeeklyHours: 10,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Friday', period: 1, reason: 'Industry Advisory Meeting' },
      { day: 'Friday', period: 2, reason: 'Industry Advisory Meeting' }
    ],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  }
];

module.exports = facultyData;
