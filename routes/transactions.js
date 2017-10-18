var express = require('express');
var router = express.Router();
const Promise = require('bluebird');

const models = require('../models');
const Sequelize = models.Sequelize;
const User = models.user;
const Transaction = models.transaction;

router.post('/', function(req, res, next) {
  Promise.all([
    User.findById(req.body.userFrom),
    User.findById(req.body.userTo)
  ])
  .spread(function(userFrom, userTo) {
    return userFrom.give(req.body.amount, userTo);
  })
  .then(function() {
    res.redirect('/users');
  })
  .catch(next);
});

module.exports = router;
