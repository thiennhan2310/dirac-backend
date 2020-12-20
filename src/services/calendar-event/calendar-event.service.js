// Initializes the `calendar-event` service on path `/calendar-event`
const createService = require('feathers-sequelize');
const createModel = require('../../models/calendar-event.model');
const hooks = require('./calendar-event.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/calendar-event', (req, res, next) => {

    console.log('headers',req.headers);
    next();
  },
  createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('calendar-event');

  service.hooks(hooks);
};
