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
        allowNull: true,
      },
      balance: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      
      user_id: {
             type: DataTypes.INTEGER,
         allowNull: false,
}
    },
    {
      tableName: "Envelops",
      timestamps: true,
      underscored: true,
    }
  );
};
