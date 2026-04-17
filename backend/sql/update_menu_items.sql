-- =====================================================
-- UPDATE Menu Items with Image Support
-- =====================================================

-- TEMPLATE (Replace [value-x] with actual values):
-- UPDATE `menu_items` SET 
--   `item_name`='[value-2]',
--   `description`='[value-3]',
--   `price`='[value-4]',
--   `category`='[value-5]',
--   `is_special`='[value-6]',
--   `is_available`='[value-7]',
--   `image_path`='[value-10]'
-- WHERE `id`=[value-1]

-- =====================================================
-- EXAMPLE 1: Update Item 1 - Veg Fried Rice with Image
-- =====================================================
UPDATE `menu_items` SET 
  `item_name`='Veg Fried Rice',
  `description`='Tasty fried rice with fresh vegetables',
  `price`='120.00',
  `category`='Veg',
  `is_special`='0',
  `is_available`='1',
  `image_path`='/uploads/veg-fried-rice.jpg'
WHERE `id`=1;

-- =====================================================
-- EXAMPLE 2: Update Item 2 - Paneer Butter Masala with Image
-- =====================================================
UPDATE `menu_items` SET 
  `item_name`='Paneer Butter Masala',
  `description`='Rich paneer curry with butter gravy',
  `price`='180.00',
  `category`='Veg',
  `is_special`='1',
  `is_available`='1',
  `image_path`='/uploads/paneer-butter-masala.jpg'
WHERE `id`=2;

-- =====================================================
-- EXAMPLE 3: Update Item 3 - Chicken Biryani with Image
-- =====================================================
UPDATE `menu_items` SET 
  `item_name`='Chicken Biryani',
  `description`='Hot and spicy chicken biryani',
  `price`='220.00',
  `category`='Non-Veg',
  `is_special`='1',
  `is_available`='1',
  `image_path`='/uploads/chicken-biryani.jpg'
WHERE `id`=3;

-- =====================================================
-- EXAMPLE 4: Update Item 4 - Chicken 65 with Image
-- =====================================================
UPDATE `menu_items` SET 
  `item_name`='Chicken 65',
  `description`='Crispy spicy chicken starter',
  `price`='190.00',
  `category`='Non-Veg',
  `is_special`='0',
  `is_available`='1',
  `image_path`='/uploads/chicken-65.jpg'
WHERE `id`=4;

-- =====================================================
-- EXAMPLE 5: Update only image_path for Item 1
-- =====================================================
UPDATE `menu_items` SET 
  `image_path`='/uploads/new-image.jpg'
WHERE `id`=1;

-- =====================================================
-- EXAMPLE 6: Mark item as special
-- =====================================================
UPDATE `menu_items` SET 
  `is_special`='1'
WHERE `id`=1;

-- =====================================================
-- EXAMPLE 7: Mark item as unavailable
-- =====================================================
UPDATE `menu_items` SET 
  `is_available`='0'
WHERE `id`=2;

-- =====================================================
-- EXAMPLE 8: Update price and image together
-- =====================================================
UPDATE `menu_items` SET 
  `price`='250.00',
  `image_path`='/uploads/updated-image.jpg'
WHERE `id`=3;

-- =====================================================
-- EXAMPLE 9: Remove image from item
-- =====================================================
UPDATE `menu_items` SET 
  `image_path`=NULL
WHERE `id`=4;

-- =====================================================
-- EXAMPLE 10: Update multiple items at once
-- =====================================================
UPDATE `menu_items` SET 
  `is_available`='0'
WHERE `category`='Non-Veg';

-- =====================================================
-- FIELD REFERENCE
-- =====================================================
-- id              = Unique item ID (AUTO_INCREMENT)
-- item_name       = Name of the menu item (VARCHAR 150)
-- description     = Item description (TEXT)
-- price           = Item price (DECIMAL 10,2)
-- category        = 'Veg' or 'Non-Veg'
-- is_special      = 1 (yes) or 0 (no)
-- is_available    = 1 (yes) or 0 (no)
-- created_at      = Auto set on creation (TIMESTAMP)
-- updated_at      = Auto updated (TIMESTAMP)
-- image_path      = Path to image file (VARCHAR 255)

-- =====================================================
-- VIEW ALL MENU ITEMS
-- =====================================================
SELECT * FROM `menu_items`;

-- =====================================================
-- VIEW SPECIFIC ITEM
-- =====================================================
SELECT * FROM `menu_items` WHERE `id`=1;
