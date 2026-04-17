const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

// Create connection without specifying database initially
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');

  // Read and execute the SQL file
  const sql = fs.readFileSync('./sql/hotel_menu.sql', 'utf8');
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('SQL execution error:', err);
      process.exit(1);
    }
    console.log('Database setup completed successfully!');
    console.log('Tables created and sample data inserted.');
    connection.end();
    process.exit(0);
  });
});
