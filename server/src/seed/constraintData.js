const constraintData = {
  name: 'MCA Department Standard Academic Constraints',
  hardConstraints: {
    facultyConflict: true,
    classroomConflict: true,
    studentGroupConflict: true,
    facultyAvailability: true,
    classroomCapacity: true,
    requiredWeeklyPeriods: true,
    roomTypeCompatibility: true
  },
  softConstraints: {
    facultyPreferences: {
      enabled: true,
      weight: 10
    },
    minimizeStudentGaps: {
      enabled: true,
      weight: 20
    },
    minimizeFacultyGaps: {
      enabled: true,
      weight: 20
    },
    balancedDistribution: {
      enabled: true,
      weight: 25
    },
    maxConsecutivePeriodsLimit: {
      enabled: true,
      maxConsecutive: 2,
      weight: 15
    }
  },
  isActive: true
};

module.exports = constraintData;
