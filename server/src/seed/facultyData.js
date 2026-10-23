const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Helper to generate full default availability (all 7 periods for all 5 days)
const defaultAvailability = () => days.map(day => ({
  day,
  periods: [1, 2, 3, 4, 5, 6, 7]
}));

const facultyData = [
  {
    facultyId: 'FAC001',
    name: 'Dr. Shahna K U',
    department: 'MCA',
    designation: 'Associate Professor & HOD',
    email: 'shahna@fisat.ac.in',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Monday', period: 1, reason: 'Department HOD Council Meeting' }
    ],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC002',
    name: 'Ms. Senu Abi',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'senuabi@fisat.ac.in',
    maxWeeklyHours: 18,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'any', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC003',
    name: 'Ms. Anju L',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'anjul@fisat.ac.in',
    maxWeeklyHours: 18,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC004',
    name: 'Ms. Joice T',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'joicet@fisat.ac.in',
    maxWeeklyHours: 18,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC005',
    name: 'Dr. Rose Mary Mathew',
    department: 'MCA',
    designation: 'Associate Professor',
    email: 'rosemary@fisat.ac.in',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC006',
    name: 'Dr. Santhosh Kottam',
    department: 'MCA',
    designation: 'Professor',
    email: 'santhoshkottam@fisat.ac.in',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [
      { day: 'Friday', period: 7, reason: 'Research & Consultancy Duty' }
    ],
    preferences: { preferredTime: 'morning', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC007',
    name: 'Dr. Rakhi Venugopal',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'rakhiv@fisat.ac.in',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'afternoon', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC008',
    name: 'Ms. Sona Mary Louis',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'sonamary@fisat.ac.in',
    maxWeeklyHours: 18,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'any', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC009',
    name: 'Dr. Sujesh P Lal',
    department: 'MCA',
    designation: 'Associate Professor',
    email: 'sujeshplal@fisat.ac.in',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'any', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC010',
    name: 'Dr. Deepa Mary Mathews',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'deepamary@fisat.ac.in',
    maxWeeklyHours: 16,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'any', maxConsecutivePeriods: 2 }
  },
  {
    facultyId: 'FAC011',
    name: 'Mr. Nithin R',
    department: 'MCA',
    designation: 'Assistant Professor',
    email: 'nithinr@fisat.ac.in',
    maxWeeklyHours: 14,
    availability: defaultAvailability(),
    unavailableSlots: [],
    preferences: { preferredTime: 'afternoon', maxConsecutivePeriods: 2 }
  }
];

module.exports = facultyData;
