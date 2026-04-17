-- =====================================================
-- SQL Code to Add Image Support to Hotel Menu System
-- =====================================================

-- 1. Add image_path column to menu_items table
ALTER TABLE menu_items ADD COLUMN image_path VARCHAR(255) DEFAULT NULL;

-- 2. Verify the column was added
DESCRIBE menu_items;

-- 3. Update existing menu items with sample image paths (optional)
UPDATE menu_items SET image_path = '/uploads/sample-1.jpg' WHERE id = 1;
UPDATE menu_items SET image_path = '/uploads/sample-2.jpg' WHERE id = 2;
UPDATE menu_items SET image_path = '/uploads/sample-3.jpg' WHERE id = 3;
UPDATE menu_items SET image_path = '/uploads/sample-4.jpg' WHERE id = 4;

-- 4. View all menu items with images
SELECT id, item_name, description, price, category, is_special, is_available, image_path FROM menu_items;

-- 5. Check menu items without images
SELECT id, item_name, price FROM menu_items WHERE image_path IS NULL;

-- 6. Complete table structure
SHOW COLUMNS FROM menu_items;
