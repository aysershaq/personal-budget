module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Users",
    {
    id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false,
},
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      income: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      }
     
    
    },
    {
      tableName: "Income",
      timestamps: true,
      underscored: true,
    }
  );
};
