const models = require('../models');
const Sequelize = models.Sequelize;
const User = models.user;
const Transaction = models.transaction;
const Promise = require('bluebird');
const faker = require('faker');
const _ = require('lodash');

describe('Transaction', function() {
  beforeEach(function() {
    return Promise.all([
      _.map(_.omit(models, ['sequelize', 'Sequelize']), function(Model) {
        return Model.destroy({truncate: true, cascade: true, force: true});
      })
    ]);
  });

  test('A transaction cannot exists between a user and null', () => {
    return User.create({username: faker.internet.userName()})
    .then(function(user) {
      return Promise.all([
        expect(Transaction.create({
          userFromId: user.id,
          userToId: null,
          amount: faker.random.number()
        }))
        .rejects.toBeInstanceOf(Sequelize.ValidationError),
        expect(Transaction.create({
          userFromId: null,
          userToId: user.id,
          amount: faker.random.number()
        }))
        .rejects.toBeInstanceOf(Sequelize.ValidationError)
      ]);
    });
  });

  test('A transaction cannot exists between the same user', () => {
    return User.create({username: faker.internet.userName()})
    .then(function(user) {
      return expect(Transaction.create({
        userFromId: user.id,
        userToId: user.id,
        amount: faker.random.number()
      }))
      .rejects.toBeInstanceOf(Sequelize.ValidationError);
    });
  });

  afterEach(function() {
    return Promise.all([
      _.map(_.omit(models, ['sequelize', 'Sequelize']), function(Model) {
        return Model.destroy({truncate: true, cascade: true, force: true});
      })
    ]);
  });
});
