const express = require('express');
const { schedularRoute } = require('../routes');

module.exports = (app, config) => {
  app.use(express.json());
  app.use('/schedules', schedularRoute(config));
};
