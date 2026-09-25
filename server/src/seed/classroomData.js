const classroomData = [
  {
    roomId: 'CR-101',
    name: 'MCA Lecture Hall 1',
    capacity: 60,
    type: 'Classroom',
    facilities: ['Projector', 'Smart Board', 'Audio System'],
    unavailableSlots: []
  },
  {
    roomId: 'CR-102',
    name: 'MCA Lecture Hall 2',
    capacity: 50,
    type: 'Classroom',
    facilities: ['Projector', 'Whiteboard'],
    unavailableSlots: []
  },
  {
    roomId: 'CR-103',
    name: 'MCA Tutorial Room',
    capacity: 35,
    type: 'Classroom',
    facilities: ['Whiteboard', 'Projector'],
    unavailableSlots: []
  },
  {
    roomId: 'LAB-01',
    name: 'Advanced Computing Lab 1',
    capacity: 60,
    type: 'Computer Lab',
    facilities: ['60 Desktop PCs', 'High-Speed Internet', 'Projector', 'Air Conditioner'],
    unavailableSlots: []
  },
  {
    roomId: 'LAB-02',
    name: 'Network & Security Lab 2',
    capacity: 40,
    type: 'Computer Lab',
    facilities: ['40 Desktop PCs', 'Cisco Packet Tracer', 'Projector'],
    unavailableSlots: [
      {
        day: 'Friday',
        period: 5,
        reason: 'Scheduled Weekly Lab Maintenance'
      }
    ]
  },
  {
    roomId: 'SEM-HALL',
    name: 'Department Seminar Hall',
    capacity: 100,
    type: 'Seminar Hall',
    facilities: ['Stage', 'Podium Mic', 'Surround Sound', 'HD Projector'],
    unavailableSlots: [
      {
        day: 'Monday',
        period: 1,
        reason: 'Weekly HOD & Department Briefing'
      }
    ]
  },
  {
    roomId: 'PROJ-LAB',
    name: 'PG Project & Research Lab',
    capacity: 35,
    type: 'Project Lab',
    facilities: ['Dedicated Workstations', 'GPU Servers', 'Wi-Fi'],
    unavailableSlots: []
  }
];

module.exports = classroomData;
