
const path = require('path');


require('dotenv').config({
  path: [
    path.resolve(__dirname, '../.env.production'),
    path.resolve(__dirname, '../.env'),
  ],
  override: true, // يخلي الأخير يفوز أو حسب ترتيبك
});
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DB_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
