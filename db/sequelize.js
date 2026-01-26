// db/sequelize.js
const { Sequelize } = require("sequelize");
const pg = require("pg");
require('dotenv').config();


if (!process.env.DB_NAME) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

// const sequelize = new Sequelize(process.env.DB_NAME, {
//   dialect: "postgres",
//   dialectModule: pg,
//   logging: false,
//   dialectOptions: {
//     ssl: { require: true, rejectUnauthorized: false },
//   },
//   pool: { max: 2, min: 0, idle: 10000, acquire: 30000 },
// });


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
  host: 'localhost',
  dialect:'postgres'
});



module.exports = sequelize;