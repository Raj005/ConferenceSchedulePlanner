const ConferenceTreeNode = require('../helpers/conferenceTreeNode');

class Schedular {
  constructor(days, talks, constraints) {
    this.days = days;
    this.talks = talks;
    this.constraints = constraints;
  }

  schedule() {
    const { days, talks, constraints } = this;
    return this.scheduleConference(days, talks, constraints);
  }

  saveTimePerPath(timePerPathHashMap, totalTimeTakenByPath, path) {
    if (!timePerPathHashMap[totalTimeTakenByPath]) {
      timePerPathHashMap[totalTimeTakenByPath] = path;
    } else {
      const existingPath = timePerPathHashMap[totalTimeTakenByPath];
      timePerPathHashMap[totalTimeTakenByPath] =
        existingPath.length > path.length ? existingPath : path;
    }
  }

  getPathsWithTotalTime(parentNode, recursionStack, timePerPathHashMap) {
    if (!parentNode) return;

    recursionStack.push(parentNode.value);

    if (!parentNode.leftChild) {
      this.saveTimePerPath(timePerPathHashMap, parentNode.totalSum, [
        ...recursionStack
      ]);
    }
    this.getPathsWithTotalTime(
      parentNode.leftChild,
      recursionStack,
      timePerPathHashMap
    );

    if (!parentNode.rightChild) {
      this.saveTimePerPath(timePerPathHashMap, parentNode.totalSum, [
        ...recursionStack
      ]);
    }
    this.getPathsWithTotalTime(
      parentNode.rightChild,
      recursionStack,
      timePerPathHashMap
    );

    recursionStack.pop();

    return timePerPathHashMap;
  }

  addTimingsAndIntervalsToSchedule(schedule, shifts, shiftIndex, constraints) {
    const { startTime, endTime } = shifts[shiftIndex];
    const endTimeInMinutes = endTime * 60;

    const scheduleWithTimingAndIntervals = [];
    let initialTime = startTime * 60;
    const { breakForCleaning, breakForLunch } = constraints;

    const intervalTemplate = {
      title: '',
      startTime: null,
      endTime: null,
      timeUnit: 'minutes',
      timeUnitFactor: 60
    };

    for (let i = 0; i < schedule.length; i++) {
      const data = {};
      const scheduleItem = schedule[i];

      data.startTime = initialTime;
      data.endTime = initialTime + scheduleItem.duration;
      data.title = scheduleItem.talkTitle;
      data.by = scheduleItem.speakers;
      data.timeUnit = 'minutes';
      data.timeUnitFactor = 60;

      if (
        shiftIndex === shifts.length - 1 &&
        i === schedule.length - 1 &&
        endTimeInMinutes - data.endTime > 0
      ) {
        const diff = endTimeInMinutes - data.endTime;
        data.startTime += diff;
        data.endTime += diff;
      }

      scheduleWithTimingAndIntervals.push(data);

      let cleaningBreak = { ...intervalTemplate };
      cleaningBreak.title = breakForCleaning.title;

      if (i < schedule.length - 1) {
        cleaningBreak.startTime = data.endTime;
        cleaningBreak.endTime = data.endTime + breakForCleaning.duration;
        scheduleWithTimingAndIntervals.push(cleaningBreak);
        initialTime = cleaningBreak.endTime;
      }

      if (
        shiftIndex === 0 &&
        i === schedule.length - 1 &&
        endTimeInMinutes - data.endTime >= breakForCleaning.duration
      ) {
        cleaningBreak.startTime = data.endTime;
        cleaningBreak.endTime = data.endTime + breakForCleaning.duration;
        scheduleWithTimingAndIntervals.push(cleaningBreak);
      }
    }

    if (shiftIndex < shifts.length - 1) {
      const lunchBreak = { ...intervalTemplate };
      lunchBreak.title = breakForLunch.title;
      lunchBreak.startTime = endTimeInMinutes;
      lunchBreak.endTime = endTimeInMinutes + breakForLunch.duration;
      scheduleWithTimingAndIntervals.push(lunchBreak);
    }

    return scheduleWithTimingAndIntervals;
  }

  applyPathToInput(optimalPath, talkDurationsHashMap, durationsPerTalk) {
    let output = [];
    for (let i = 0; i < optimalPath.length; i++) {
      const talkDuration = optimalPath[i];
      const talks = talkDurationsHashMap[talkDuration];

      if (talks.length > 0) {
        const talk = talks.pop();
        output.push(talk);
      } else {
        if (
          !talkDurationsHashMap[durationsPerTalk[0]].length &&
          !talkDurationsHashMap[durationsPerTalk[1]].length
        ) {
          // Given input exhausted or finished
          break;
        }

        // Given optimal path did not match with given input
        while (output.length) {
          const talk = output.pop();
          talkDurationsHashMap[talk.duration].push(talk);
        }
        break;
      }
    }
    return output;
  }

  shouldCreateChild(
    parentNodeTotalSum,
    parentNodeEdgeWeight,
    childValue,
    totalTimePeriod
  ) {
    return (
      parentNodeTotalSum + parentNodeEdgeWeight + childValue <= totalTimePeriod
    );
  }

  shouldCreateLeftChild(leftChildValue, node, totalTimePeriod) {
    return this.shouldCreateChild(
      node.totalSum,
      node.edgeWeight,
      leftChildValue,
      totalTimePeriod
    );
  }

  shouldCreateRightChild(rightChildValue, node, totalTimePeriod) {
    return this.shouldCreateChild(
      node.totalSum,
      node.edgeWeight,
      rightChildValue,
      totalTimePeriod
    );
  }

  addChildrenToNode(node, edgeWeight, children, totalTimePeriod) {
    if (!node) return;
    const { leftChildValue, rightChildValue } = children;

    if (this.shouldCreateLeftChild(leftChildValue, node, totalTimePeriod)) {
      node.leftChild = new ConferenceTreeNode(leftChildValue, edgeWeight);
      node.leftChild.totalSum =
        node.totalSum + node.edgeWeight + leftChildValue;
    }

    if (this.shouldCreateRightChild(rightChildValue, node, totalTimePeriod)) {
      node.rightChild = new ConferenceTreeNode(rightChildValue, edgeWeight);
      node.rightChild.totalSum =
        node.totalSum + node.edgeWeight + rightChildValue;
    }

    this.addChildrenToNode(
      node.leftChild,
      edgeWeight,
      children,
      totalTimePeriod
    );

    this.addChildrenToNode(
      node.rightChild,
      edgeWeight,
      children,
      totalTimePeriod
    );

    return node;
  }

  constructTreeForGivenTimePeriod(
    rootNodeValue,
    edgeWeight,
    childrenValue,
    totalTimePeriod
  ) {
    const parentNode = new ConferenceTreeNode(rootNodeValue, edgeWeight);
    parentNode.totalSum = rootNodeValue;

    return this.addChildrenToNode(
      parentNode,
      edgeWeight,
      childrenValue,
      totalTimePeriod
    );
  }

  schedular(
    durationPerTalk,
    talkDurationsHashMap,
    constraints,
    totalTimePeriod
  ) {
    let schedule = [];
    const output = { duration: 0, schedule: [] };
    const { breakForCleaning, durationsPerTalk } = constraints;
    const childrenValue = {
      leftChildValue: durationsPerTalk[0],
      rightChildValue: durationsPerTalk[1]
    };

    const tree = this.constructTreeForGivenTimePeriod(
      durationPerTalk,
      breakForCleaning.duration,
      childrenValue,
      totalTimePeriod
    );
    const timePerPathHashMap = this.getPathsWithTotalTime(tree, [], {});

    const durations = Object.keys(timePerPathHashMap)
      .map(key => parseInt(key))
      .sort();

    while (durations.length) {
      const duration = durations.pop();
      const optimalPath = timePerPathHashMap[duration];

      schedule = this.applyPathToInput(
        optimalPath,
        talkDurationsHashMap,
        durationsPerTalk
      );

      if (schedule.length > 0) {
        // we found a schedule so break the loop!!!!!
        output.schedule = schedule;
        output.duration = duration;
        break;
      }
    }

    return output;
  }

  createTalkAndDurationHashMap(talks, key, constraints) {
    const { durationsPerTalk } = constraints;
    const talkDurationsHashMap = {};
    talkDurationsHashMap[durationsPerTalk[0]] = [];
    talkDurationsHashMap[durationsPerTalk[1]] = [];

    talks.map(talk => {
      if (!talkDurationsHashMap[talk[key]]) {
        talkDurationsHashMap[talk[key]] = [talk];
      } else {
        talkDurationsHashMap[talk[key]].push(talk);
      }
    });

    return talkDurationsHashMap;
  }

  scheduleConference(days, talks, constraints) {
    if (!talks.length) return [];
    let schedule = [];
    const talkDurationsHashMap = this.createTalkAndDurationHashMap(
      talks,
      'duration',
      constraints
    );
    const { durationsPerTalk } = constraints;

    for (let i = 0; i < days.length; i++) {
      const { dayId, shifts } = days[i];
      const schedulePerDay = [];

      for (let j = 0; j < shifts.length; j++) {
        const { startTime, endTime } = shifts[j];
        const totalTimePeriod = (endTime - startTime) * 60;
        let subSchedule = [];

        const subScheduleFirst = this.schedular(
          durationsPerTalk[0],
          talkDurationsHashMap,
          constraints,
          totalTimePeriod
        );
        const subScheduleSecond = this.schedular(
          durationsPerTalk[1],
          talkDurationsHashMap,
          constraints,
          totalTimePeriod
        );
        if (subScheduleFirst.duration > subScheduleSecond.duration) {
          subSchedule = subScheduleFirst.schedule;
        } else {
          subSchedule = subScheduleSecond.schedule;
        }

        const subScheduleWithTimingsAndIntervals = this.addTimingsAndIntervalsToSchedule(
          subSchedule,
          shifts,
          j,
          constraints
        );
        schedulePerDay.push(...subScheduleWithTimingsAndIntervals);
      }
      schedule.push(schedulePerDay);
    }

    return schedule;
  }
}

module.exports = Schedular;
