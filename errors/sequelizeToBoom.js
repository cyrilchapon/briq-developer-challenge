const Sequelize = require('sequelize');
const boom = require('boom');

module.exports = function(err, req, res, next) {
  if(err.isBoom) {
    return next(err);
  }

  let newErr;
  if(err instanceof Sequelize.ValidationError) {
    //User request
    newErr = boom.boomify(err, {statusCode: 400});
  } else if(err instanceof Sequelize.ForeignKeyConstraintError || err instanceof Sequelize.ExclusionConstraintError) {
    //Conflict
    newErr = boom.boomify(err, {statusCode: 409});
  } else {
    //Unknown
    newErr = boom.boomify(err, {statusCode: 500})
  }

  return next(newErr);
}
