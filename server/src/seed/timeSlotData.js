const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const periodTimings = [
  { period: 1, startTime: '09:00 AM', endTime: '10:00 AM' },
  { period: 2, startTime: '10:00 AM', endTime: '11:00 AM' },
  { period: 3, startTime: '11:15 AM', endTime: '12:15 PM' },
  { period: 4, startTime: '01:15 PM', endTime: '02:15 PM' },
  { period: 5, startTime: '02:15 PM', endTime: '03:15 PM' },
  { period: 6, startTime: '03:15 PM', endTime: '04:15 PM' }
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
