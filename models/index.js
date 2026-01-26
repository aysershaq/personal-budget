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
db.Transactions.belongsTo(db.Envelops, { foreignKey: "from_envelop_id", as: "from" });
db.Transactions.belongsTo(db.Envelops, { foreignKey: "to_envelop_id", as: "to" });

db.Income.belongsTo(db.Users,{ foreignKey: "user_id", as: "userId" })
db.Expenses.belongsTo(db.Users,{ foreignKey: "user_id", as: "userId" })

module.exports = db; // ✅ رجّع db مباشرة
