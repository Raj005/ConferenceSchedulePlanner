class ConferenceSchedule {
  constructor(schedular) {
    this.schedular = schedular;
  }

  generateConferenceSchedule() {
    return this.schedular.schedule();
  }
}

module.exports = ConferenceSchedule;
