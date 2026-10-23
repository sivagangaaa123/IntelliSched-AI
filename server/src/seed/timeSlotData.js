const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const periodTimings = [
  { period: 1, startTime: '08:00 AM', endTime: '08:50 AM' },
  { period: 2, startTime: '08:50 AM', endTime: '09:40 AM' },
  { period: 3, startTime: '09:55 AM', endTime: '10:45 AM' },
  { period: 4, startTime: '10:45 AM', endTime: '11:35 AM' },
  { period: 5, startTime: '11:50 AM', endTime: '12:40 PM' },
  { period: 6, startTime: '12:40 PM', endTime: '01:30 PM' },
  { period: 7, startTime: '02:00 PM', endTime: '03:30 PM' }
];

const timeSlotData = [];

days.forEach((day) => {
  periodTimings.forEach((pt) => {
    timeSlotData.push({
      slotId: `${day.substring(0, 3).toUpperCase()}_P${pt.period}`,
      day,
      period: pt.period,
      startTime: pt.startTime,
      endTime: pt.endTime,
      isLunchBreak: false
    });
  });
});

module.exports = timeSlotData;
