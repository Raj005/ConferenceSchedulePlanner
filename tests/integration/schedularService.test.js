const { days, talks, constraints } = require('../mocks');
const schedularService = require('../../services/schedule');

describe('testing schedular service', () => {
  test('should generate a schedule for given time period', () => {
    const schedule = schedularService.generateConferenceSchedule(
      days,
      talks,
      constraints
    );
    expect(schedule.length).toEqual(days.length);
  });
});
