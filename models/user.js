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
      allowNull: false
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
      return Promise.all([
        userFrom.reload({attributes: ['balance'], transaction: t}),
        userTo.reload({attributes: ['balance'], transaction: t})
      ])
      .then(function() {
        return userFrom.createDebit(tx, {transaction: t})
      })
      .then(function() {
        userFrom.balance = userFrom.balance - amount;
        userTo.balance = userTo.balance + amount;

        return Promise.all([
          userFrom.save({transaction: t}),
          userTo.save({transaction: t})
        ]);
      });
    });
  };

  User.associate = function (models) {
    User.hasMany(models.transaction, { as: 'credits', foreignKey: 'userToId' });
    User.hasMany(models.transaction, { as: 'debits', foreignKey: 'userFromId' });
  }

  return User;
}
