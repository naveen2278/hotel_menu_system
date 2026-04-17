const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Enable support for multiple statements if needed in the future
  multipleStatements: true
});

// Test connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL Connection Pool Error:', err);
  } else {
    console.log('MySQL Connected Successfully (Using Connection Pool)');
    connection.release();
  }
});

module.exports = db;