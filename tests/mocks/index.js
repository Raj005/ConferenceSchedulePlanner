module.exports = {
  talks: [
    {
      talkTitle: 'awesome coding challenge',
      duration: 50,
      speakers: 'speaker1'
    },
    { talkTitle: 'nodejs talk', duration: 30, speakers: 'speaker2' },
    { talkTitle: 'reactjs talk', duration: 50, speakers: 'speaker3' },
    { talkTitle: 'why Yunar rocks', duration: 30, speakers: 'speaker4' },
    { talkTitle: 'something', duration: 50, speakers: 'speaker5' },
    { talkTitle: 'new tech companies', duration: 50, speakers: 'speaker6' },
    { talkTitle: 'Time management', duration: 30, speakers: 'speaker7' }
  ],

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
