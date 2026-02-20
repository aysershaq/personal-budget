// db/sequelize.js
const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config({
  path: [
    path.resolve(__dirname, "../.env.production"),
    path.resolve(__dirname, "../.env"),
  ],
  override: true,
});

const isProd = process.env.NODE_ENV === "production";

// استخدم متغير واحد ثابت في الإنتاج: DATABASE_URL (مفضل)
const prodUrl = process.env.DATABASE_URL || process.env.DB_URL;

// متغير سنصدره في النهاية
let sequelize;

if (!isProd) {
  // Development (Local)
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

  if (!DB_NAME || !DB_USER) {
    throw new Error(
      "Missing DB_NAME / DB_USER for development. Check your .env file."
    );
  }

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST || "localhost",
    port: DB_PORT ? Number(DB_PORT) : 5432,
    dialect: "postgres",
    logging: false,
  });
} else {
  // Production (Neon)
  if (!prodUrl) {
    throw new Error(
      "Missing DATABASE_URL (or DB_URL) for production. Put Neon connection string in .env.production."
    );
  }

  sequelize = new Sequelize(prodUrl, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: { max: 5, min: 0, idle: 10000, acquire: 30000 },
  });
}

module.exports = sequelize;