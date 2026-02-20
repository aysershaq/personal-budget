// models/index.js
const sequelize = require("../db/sequelize"); // ✅ هذا لازم يكون instance جاهز
const { DataTypes } = require("sequelize");

const envelopsModel = require("./Envelops");
const transactionsModel = require("./transactions");
const usersModel = require("./Users"); // 
const incomeModel = require("./Income");

const expensesModel = require("./expenses")

const db = {};
db.sequelize = sequelize;

db.Envelops = envelopsModel(sequelize, DataTypes);
db.Transactions = transactionsModel(sequelize, DataTypes);
db.Income = incomeModel(sequelize,DataTypes)
db.Expenses = expensesModel(sequelize,DataTypes)
db.Users = usersModel(sequelize, DataTypes); // ✅ أضف هذا
// db.Transactions.belongsTo(db.Envelops, { foreignKey: "envelop_id", as: "envelop-id" });
db.Transactions.belongsTo(db.Envelops, { foreignKey: 'envelop_id' });
db.Envelops.hasMany(db.Transactions, { foreignKey: 'envelop_id' });

module.exports = db; // ✅ رجّع db مباشرة
