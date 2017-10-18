const models = require('../models');
const User = models.user;
const Transaction = models.transaction;
const Promise = require('bluebird');
const faker = require('faker');
const _ = require('lodash');

function getRandomUserValues(values) {
  return _.merge({
    username: faker.internet.userName(),
    balance: faker.random.number()
  }, values);
}

test('A user has a default balance of 0', () => {
  const user = User.build();
  expect(user.balance).toEqual(0);
});

describe('.give()', function() {
  beforeEach(function() {
    return Promise.all([
      _.map(_.omit(models, ['sequelize', 'Sequelize']), function(Model) {
        return Model.destroy({truncate: true, cascade: true, force: true});
      })
    ]);
  });

  test('A give() increments and decrements', () => {
    let amount = 3;

    const initialUserFromData = getRandomUserValues();
    const initialUserToData = getRandomUserValues();

    return Promise.all([
      User.create(_.cloneDeep(initialUserFromData)),
      User.create(_.cloneDeep(initialUserToData))
    ])
    .spread(function(userFrom, userTo) {
      return Promise.all([
        userFrom,
        userTo,
        userFrom.give(amount, userTo)
      ]);
    })
    .spread(function(userFrom, userTo) {
      expect(userFrom.balance).toEqual(initialUserFromData.balance - amount);
      expect(userTo.balance).toEqual(initialUserToData.balance + amount);

      return Transaction.findOne({
        userFrom: userFrom,
        userTo: userTo
      });
    })
    .then(function(transaction) {
      expect(transaction).toBeTruthy();
      expect(transaction.amount).toEqual(amount);
    });
  });

  test('Giving briqs under user balance fails', () => {
    let amount = 3;

    return expect(Promise.all([
      User.create(getRandomUserValues({balance: 2})),
      User.create(getRandomUserValues())
    ])
    .spread(function(userFrom, userTo) {
      return Promise.all([
        userFrom,
        userTo,
        userFrom.give(amount, userTo)
      ]);
    })).rejects.toBeTruthy();
  });

  test('Giving briqs (with obsolete values) under user balance fails', () => {
    let amount = 3;

    const initialUserFromData = getRandomUserValues({balance: 2});
    const initialUserToData = getRandomUserValues();

    return expect(Promise.all([
      User.create(_.cloneDeep(initialUserFromData)),
      User.create(_.cloneDeep(initialUserToData))
    ])
    .spread(function(userFrom, userTo) {
      userFrom.balance = faker.random.number({min: amount});

      return Promise.all([
        userFrom,
        userTo,
        userFrom.give(amount, userTo)
      ]);
    })).rejects.toBeTruthy();
  });

  afterEach(function() {
    return Promise.all([
      _.map(_.omit(models, ['sequelize', 'Sequelize']), function(Model) {
        return Model.destroy({truncate: true, cascade: true, force: true});
      })
    ]);
  });
});
