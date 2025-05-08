const mysql = require('mysql');

const envConfig = require('../config/envconfig');


const pool = mysql.createPool({
  host: envConfig.dbHost,
  user: envConfig.dbUser,
  password: envConfig.dbPassword,
  database: envConfig.dbName,
  charset: 'utf8mb4',
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

// Test kết nối
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL not Connected...');
    console.error(err);
  } else {
    console.log('MySQL Connected...');
    connection.release(); 
  }
});

module.exports = pool;
