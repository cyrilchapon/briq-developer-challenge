var express = require('express');
var router = express.Router();
const boom = require('boom');

const models = require('../models');
const Sequelize = models.Sequelize;
const User = models.user;

router.get('/', function(req, res, next) {
  User.findAll({
    order: Sequelize.col('username'),
    raw: true
  })
  .then(function(users) {
    res.render('users', { users: users });
  });
});

router.post('/', function(req, res, next) {
  User.create(req.body)
  .then(function() {
    res.redirect('/users');
  })
  .catch(next);
});

router.delete('/:id', function(req, res, next) {
  User.findById(req.params.id)
  .then(function(user) {
    if(!user) {
      throw boom.notFound('User not found');
    }

    return user.destroy();
  })
  .then(function() {
    res.redirect('/users');
  })
  .catch(next);
});

module.exports = router;
