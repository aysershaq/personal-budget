module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define(
    "Transactions",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // ✅ الصحيح (وليس autoIncement)
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
     
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING, // ✅ لازم نص
        allowNull: false,
      },
      from_envelop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to_envelop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Transactions",
      timestamps: true, // ✅ لتجنب created_at/updated_at
    }
  );

  return Transactions;
};
