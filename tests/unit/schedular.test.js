const { days, talks, constraints } = require('../mocks');
const Schedular = require('../../lib/core/schedular');

describe('testing schedular library', () => {
  test('should generate a schedule for the given time period', () => {
    const schedular = new Schedular(days, talks, constraints);
    const schedule = schedular.schedule();
    expect(schedule.length).toEqual(days.length);
  });

  test('should generate a tree for the given time period', () => {
    const schedular = new Schedular(days, talks, constraints);
    const { durationsPerTalk } = constraints;
    const childrenValue = {
      leftChildValue: durationsPerTalk[0],
      rightChildValue: durationsPerTalk[1]
    };
    const totalTimePeriod = 180; // 3 hours
    const tree = schedular.constructTreeForGivenTimePeriod(
      50,
      15,
      childrenValue,
      totalTimePeriod
    );
    expect(tree).toBeTruthy();
  });

  test('should generate an optimal combination with minimal breaks for the given time period', () => {
    const schedular = new Schedular(days, talks, constraints);
    const { durationsPerTalk } = constraints;
    const childrenValue = {
      leftChildValue: durationsPerTalk[0],
      rightChildValue: durationsPerTalk[1]
    };
    const totalTimePeriod = 180; // 3 hours
    const tree = schedular.constructTreeForGivenTimePeriod(
      50,
      15,
      childrenValue,
      totalTimePeriod
    );
    const timePerPathHashMap = schedular.getPathsWithTotalTime(tree, [], {});
    const durations = Object.keys(timePerPathHashMap)
      .map(key => parseInt(key))
      .sort();
    const duration = durations.pop(); // get the highest value or optimal duration
    const optimalPath = timePerPathHashMap[duration]; // [50, 50, 50]
    expect(optimalPath.length).toEqual(3);
  });

  test('should add intervals to the schedule', () => {
    const schedular = new Schedular(days, talks, constraints);
    const { shifts } = days[0];

    const talkDurationsHashMap = schedular.createTalkAndDurationHashMap(
      talks,
      'duration',
      constraints
    );
    const { schedule } = schedular.schedular(
      50,
      talkDurationsHashMap,
      constraints,
      180
    );

    expect(schedule.length).toEqual(3); // before intervals

    const scheduleWithIntervals = schedular.addTimingsAndIntervalsToSchedule(
      schedule,
      shifts,
      0,
      constraints
    );
    expect(scheduleWithIntervals.length).toEqual(6); // after intervals
  });

  test('should generate a schedule object with desired keys', () => {
    const desiredKeys = [
      'startTime',
      'endTime',
      'title',
      'by',
      'timeUnit',
      'timeUnitFactor'
    ];
    const schedular = new Schedular(days, talks, constraints);
    const schedule = schedular.schedule();
    const scheduleObject = schedule[0][0];
    const scheduleObjectKeys = Object.keys(scheduleObject);
    const filteredKeys = scheduleObjectKeys.filter(key =>
      desiredKeys.includes(key)
    );

    expect(filteredKeys.length).toEqual(scheduleObjectKeys.length);
  });

  test('should start a talk at 9:00', () => {
    const schedular = new Schedular(days, talks, constraints);
    const schedule = schedular.schedule();
    const { startTime } = schedule[0][0];
    expect(startTime).toEqual(9 * 60);
  });

  test('should end a talk at 17:00', () => {
    const schedular = new Schedular(days, talks, constraints);
    const schedule = schedular.schedule();
    const day = schedule[0];
    const { endTime } = day[day.length - 1];
    expect(endTime).toEqual(17 * 60);
  });
});
