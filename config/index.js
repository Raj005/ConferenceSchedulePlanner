module.exports = {
  port: 3000,
  days: [
    {
      dayId: 1,
      shifts: [
        { shiftId: 1, startTime: 9, endTime: 12 },
        { shiftId: 2, startTime: 13, endTime: 17 }
      ]
    },
    {
      dayId: 2,
      shifts: [
        { shiftId: 1, startTime: 9, endTime: 12 },
        { shiftId: 2, startTime: 13, endTime: 17 }
      ]
    },
    {
      dayId: 3,
      shifts: [
        { shiftId: 1, startTime: 9, endTime: 12 },
        { shiftId: 2, startTime: 13, endTime: 17 }
      ]
    }
  ],
  constraints: {
    breakForCleaning: { title: 'break for cleaning', duration: 15 },
    durationsPerTalk: [30, 50],
    breakForLunch: { title: 'break for Lunch', duration: 60 }
  }
};
