const { sequelize } = require('./index');

module.exports = (sequelize, DataTypes) => {

  const Transaction = sequelize.define('transaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  });

  function userFromDifferentFromUserToValidation() {
    if(this.userFromId === this.userToId) {
      throw new Error('userFrom and userTo should be different');
    }
  };

  Transaction.associate = function(models) {
    Transaction.belongsTo(models.user, { as: 'userFrom', foreignKey: {
      validate: {
        userFromDifferentFromUserTo: userFromDifferentFromUserToValidation
      },
      allowNull: false
    }});
    Transaction.belongsTo(models.user, { as: 'userTo', foreignKey: {
      validate: {
        userFromDifferentFromUserTo: userFromDifferentFromUserToValidation
      },
      allowNull: false
    }});
  }

  return Transaction;
}
