module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Expenses",
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
      spent: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      }
     
    
    },
    {
      tableName: "Expenses",
      timestamps: true,
      underscored: true,
    }
  );
};
