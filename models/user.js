const { sequelize } = require('./index');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3]
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  });

  User.prototype.give = function (amount, userTo, options = {}) {
    const userFrom = this;
    const tx = _.defaults({ amount, userToId: userTo.id }, options);

    return sequelize.transaction(function(t) {
      //create local copies, avoid reload if transaction fail
      return Promise.all([
        User.findById(userFrom.id, {transaction: t}),
        User.findById(userTo.id, {transaction: t})
      ])
      //create debit
      .spread(function(localUserFrom, localUserTo) {
        return Promise.all([
          localUserFrom,
          localUserTo,
          localUserFrom.createDebit(tx, {transaction: t})
        ]);
      })
      //update user balances
      .spread(function(localUserFrom, localUserTo, transaction) {
        localUserFrom.balance = localUserFrom.balance - transaction.amount;
        localUserTo.balance = localUserTo.balance + transaction.amount;

        return Promise.all([
          localUserFrom.save({transaction: t}),
          localUserTo.save({transaction: t})
        ]);
      });
    })
    .then(function() {
      //if transaction succeed, refresh user balance
      return Promise.all([
        userFrom.reload({attributes: ['balance']}),
        userTo.reload({attributes: ['balance']})
      ]);
    });
  };

  User.associate = function (models) {
    User.hasMany(models.transaction, { as: 'credits', foreignKey: 'userToId' });
    User.hasMany(models.transaction, { as: 'debits', foreignKey: 'userFromId' });
  }

  return User;
}
