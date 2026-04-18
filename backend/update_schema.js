const db = require('./db');

async function updateSchema() {
  try {
    console.log('Updating schema...');
    await db.promise().query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS customer_name VARCHAR(100) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS order_type ENUM('Dine-in', 'Parcel') DEFAULT 'Dine-in'
    `);
    console.log('Schema updated successfully');
  } catch (err) {
    if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('Columns might already exist.');
    } else {
        console.error('Error updating schema:', err.message);
    }
  } finally {
    process.exit(0);
  }
}

updateSchema();
