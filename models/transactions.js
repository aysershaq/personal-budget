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
      envelop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to_envelop_id: {
       type: DataTypes.INTEGER,
        allowNull: true,

      },
      envelope_name:{
        type: DataTypes.STRING, // ✅ لازم نص
        allowNull: true,
      },
      to_envelop:{
        type: DataTypes.STRING, // ✅ لازم نص
        allowNull: true,
      }
    },
    {
      tableName: "Transactions",
      timestamps: true, 
        underscored: true
// ✅ لتجنب created_at/updated_at
    }
  );

  return Transactions;
};
