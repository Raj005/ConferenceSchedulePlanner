const Schedular = require('../../lib/core/schedular');
const ServiceBaseClass = require('./serviceBaseClass');

module.exports = () => {
  return {
    generateConferenceSchedule: (days, talks, constraints) => {
      const schedular = new Schedular(days, talks, constraints);
      const serviceInstance = new ServiceBaseClass(schedular);
      return serviceInstance.generateConferenceSchedule();
    }
  };
};
