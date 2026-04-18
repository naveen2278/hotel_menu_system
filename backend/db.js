const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_menu_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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