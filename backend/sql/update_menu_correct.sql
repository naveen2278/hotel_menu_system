-- =====================================================
-- UPDATE Menu Items - WORKING EXAMPLES (Copy & Paste)
-- =====================================================

-- =====================================================
-- EXAMPLE 1: Update Item 1 - Veg Fried Rice
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
-- EXAMPLE 2: Update Item 2 - Paneer Butter Masala
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
-- EXAMPLE 3: Update Item 3 - Chicken Biryani
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
-- EXAMPLE 4: Update Item 4 - Chicken 65
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
-- EXAMPLE 5: Update ONLY Image Path
-- =====================================================
UPDATE `menu_items` SET `image_path`='/uploads/new-photo.jpg' WHERE `id`=1;

-- =====================================================
-- EXAMPLE 6: Mark as Special
-- =====================================================
UPDATE `menu_items` SET `is_special`='1' WHERE `id`=1;

-- =====================================================
-- EXAMPLE 7: Mark as Unavailable
-- =====================================================
UPDATE `menu_items` SET `is_available`='0' WHERE `id`=2;

-- =====================================================
-- EXAMPLE 8: Update Multiple Fields
-- =====================================================
UPDATE `menu_items` SET 
  `price`='250.00',
  `is_special`='1',
  `image_path`='/uploads/updated.jpg'
WHERE `id`=3;
