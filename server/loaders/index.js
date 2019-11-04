const expressLoader = require('./express');

module.exports = async (app, config) => {
  await expressLoader(app, config);
  // other loaders can go here
};
