const service = require('./service');
const serviceMethods = service();

module.exports = {
  generateConferenceSchedule: (days, talks, constraints) => {
    return serviceMethods.generateConferenceSchedule(days, talks, constraints);
  }
};
