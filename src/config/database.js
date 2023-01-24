require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: '127.0.0.1',
    port: process.env.MYSQLDB_LOCAL_PORT,
    dialect: 'mysql',
  },
  test: {
    username: process.env.MYSQLDB_USER_STAGE,
    password: process.env.MYSQLDB_ROOT_PASSWORD_STAGE,
    database: process.env.MYSQLDB_DATABASE_STAGE,
    host: '172.28.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.MYSQLDB_USER_PROD,
    password: process.env.MYSQLDB_ROOT_PASSWORD_PROD,
    database: process.env.MYSQLDB_DATABASE_PROD,
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
