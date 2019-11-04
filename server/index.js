const express = require('express');
const loaders = require('./loaders');
const config = require('../config');

const startServer = async () => {
  const app = express();

  await loaders(app, config);

  app.listen(config.port, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`server is running on localhost:${config.port}`);
  });
};

startServer();
