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

  Transaction.associate = function(models) {
    Transaction.belongsTo(models.user, { as: 'userFrom', foreignKey: {
      validate: {
        userFromDifferentFromUserTo: function() {
          if(this.userFromId === this.userToId) {
            throw new Error('userFrom and userTo should be different');
          }
        }
      },
      allowNull: false
    }});
    Transaction.belongsTo(models.user, { as: 'userTo', foreignKey: {
      validate: {
        userFromDifferentFromUserTo: function() {
          if(this.userFromId === this.userToId) {
            throw new Error('userFrom and userTo should be different');
          }
        }
      },
      allowNull: false
    }});
  }

  return Transaction;
}
