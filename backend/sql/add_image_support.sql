-- Add image support to hotel_menu_system database

-- ALTER menu_items table to add image_path column
ALTER TABLE menu_items ADD COLUMN image_path VARCHAR(255) DEFAULT NULL;

-- Optional: Add image_uploaded_at timestamp to track when image was uploaded
ALTER TABLE menu_items ADD COLUMN image_uploaded_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

-- Optional: View the updated table structure
DESCRIBE menu_items;

-- Optional: View all menu items with their images
SELECT id, item_name, price, category, image_path, image_uploaded_at FROM menu_items;
