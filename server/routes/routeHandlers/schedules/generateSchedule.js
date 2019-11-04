module.exports = (services, config) => {
  return (req, res) => {
    try {
      const { days, constraints } = config;
      const { talks } = req.body;
      const schedule = services.scheduleService.generateConferenceSchedule(
        days,
        talks,
        constraints
      );

      res.status(200).json({ schedule });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};
