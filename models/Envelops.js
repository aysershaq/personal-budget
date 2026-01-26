module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Envelops",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // ✅ تصحيح
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_budget: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      spent: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      user_id: {
             type: DataTypes.INTEGER,
         allowNull: false,
}
    },
    {
      tableName: "Envelops",
      timestamps: false,
      underscored: true,
    }
  );
};
