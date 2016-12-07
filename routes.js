'use strict';

var home = require('./controllers/home_controller');
var api = require('./controllers/api_controller');

module.exports = (app) => {
  app.use('/', home);
  app.use('/api',api);
};
