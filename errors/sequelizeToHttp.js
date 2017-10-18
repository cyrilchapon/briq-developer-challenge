const Sequelize = require('../models').Sequelize;

module.exports = function(err, req, res, next) {
  if(err instanceof Sequelize.ValidationError) {
    err.status = 400;
  }

  next(err);
}
