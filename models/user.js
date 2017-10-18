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
    const tx = _.defaults({ amount, userToId: userTo.id }, options);
    return this.createDebit(tx)
      .then(() => {
        this.balance = this.balance - amount;
        userTo.balance = userTo.balance + amount;

        return Promise.all([
          this.save(),
          userTo.save()
        ]);
      });
  };

  User.associate = function (models) {
    User.hasMany(models.transaction, { as: 'credits', foreignKey: 'userToId' });
    User.hasMany(models.transaction, { as: 'debits', foreignKey: 'userFromId' });
  }

  return User;
}
