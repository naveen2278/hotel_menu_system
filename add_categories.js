const db = require('./backend/db');

async function run() {
  try {
    // Manually use the promise wrapper to make it easier
    const promiseDb = db.promise();

    // 1. Alter table to expand category ENUM
    console.log("Altering table to add new categories...");
    await promiseDb.query(`
      ALTER TABLE menu_items 
      MODIFY COLUMN category ENUM('Veg', 'Non-Veg', 'Fresh Juice', 'Soda', 'Ice Cream', 'Desserts') NOT NULL
    `);
    
    // 2. Insert new sample items
    console.log("Inserting sample data for new categories...");
    const items = [
      ['Orange Juice', 'Freshly squeezed sweet oranges', 80.00, 'Fresh Juice', 0, 1],
      ['Watermelon Juice', 'Refreshing summer watermelon juice', 70.00, 'Fresh Juice', 0, 1],
      ['Classic Cola', 'Chilled classic cola with ice', 40.00, 'Soda', 0, 1],
      ['Lemon Soda', 'Fresh lemon juice with soda and mint', 50.00, 'Soda', 0, 1],
      ['Vanilla Ice Cream', 'Two scoops of classic vanilla', 90.00, 'Ice Cream', 0, 1],
      ['Chocolate Fudge Sundae', 'Rich chocolate ice cream with fudge syrup', 150.00, 'Ice Cream', 1, 1],
      ['Gulab Jamun', 'Sweet milk dumplings in rose syrup', 60.00, 'Desserts', 0, 1],
      ['Brownie Sizzler', 'Hot chocolate brownie with ice cream', 180.00, 'Desserts', 1, 1]
    ];

    for (let item of items) {
      await promiseDb.query(
        'INSERT INTO menu_items (item_name, description, price, category, is_special, is_available) VALUES (?, ?, ?, ?, ?, ?)', 
        item
      );
    }
    
    console.log("Successfully added new categories and items!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating database:", err);
    process.exit(1);
  }
}

run();
