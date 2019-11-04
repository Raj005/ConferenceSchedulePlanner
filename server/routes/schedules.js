const express = require('express');
const router = express.Router();
const services = require('../../services');
const { scheduleInputValidator } = require('../middlewares');
const { schedulesRouteHandlers } = require('./routeHandlers');

module.exports = config => {
  router.post(
    '/',
    scheduleInputValidator,
    schedulesRouteHandlers.generateSchedule(services, config)
  );

  return router;
};
