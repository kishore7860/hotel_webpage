import db from '../config/database.js';
import initializeDatabase from './init.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  initializeDatabase();

  // Clear existing data
  db.exec('DELETE FROM reward_transactions');
  db.exec('DELETE FROM order_items');
  db.exec('DELETE FROM orders');
  db.exec('DELETE FROM menu_items');
  db.exec('DELETE FROM categories');
  db.exec('DELETE FROM discounts');
  db.exec('DELETE FROM users');

  // Reset auto increment
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('categories', 'menu_items', 'discounts', 'users', 'orders', 'order_items', 'reward_transactions')");

  // Seed categories
  const categories = [
    { name: 'Fried Special Chicken', description: 'Crispy and delicious fried chicken specials', display_order: 1 },
    { name: 'Pizza', description: 'Hand-tossed pizzas with premium toppings', display_order: 2 },
    { name: 'Family Combo', description: 'Large combo meals perfect for sharing', display_order: 3 },
    { name: 'Burger', description: 'Juicy burgers with fresh ingredients', display_order: 4 },
    { name: 'Shawarma', description: 'Authentic Middle Eastern wraps', display_order: 5 },
    { name: 'Sandwich', description: 'Fresh sandwiches made to order', display_order: 6 },
    { name: 'Wraps', description: 'Delicious wraps with flavorful fillings', display_order: 7 },
    { name: 'Veg Snackup', description: 'Vegetarian snacks and sides', display_order: 8 },
    { name: 'Non Veg Snackup', description: 'Non-vegetarian snacks and sides', display_order: 9 },
    { name: 'Kids Special Pizza', description: 'Kid-friendly pizza options', display_order: 10 },
    { name: 'Buddy Meals', description: 'Meal combos for two', display_order: 11 },
    { name: 'Dips', description: 'Delicious dipping sauces', display_order: 12 }
  ];

  const insertCategory = db.prepare('INSERT INTO categories (name, description, display_order) VALUES (?, ?, ?)');
  categories.forEach(cat => insertCategory.run(cat.name, cat.description, cat.display_order));

  // Seed menu items
  const menuItems = [
    // Fried Special Chicken (category_id: 1)
    { category_id: 1, name: 'Chicken Popcorn', description: 'Bite-sized crispy chicken pieces, perfectly seasoned', price: 149, is_featured: 1, prep_time_minutes: 15, image_url: '/images/food/chicken-popcorn.png' },
    { category_id: 1, name: 'Chicken Lollipop', description: 'Crispy fried chicken drumettes with tangy sauce', price: 199, is_featured: 1, prep_time_minutes: 20, image_url: '/images/food/chicken-lollipop.png' },
    { category_id: 1, name: '4 Chicken Wings', description: 'Crispy wings with your choice of sauce', price: 179, prep_time_minutes: 15, image_url: '/images/food/4-chicken-wings.png' },
    { category_id: 1, name: 'Fried Chicken (2 Pcs)', description: 'Classic fried chicken, crispy outside, juicy inside', price: 199, is_featured: 1, prep_time_minutes: 20, image_url: '/images/food/fried-chicken-2-pcs.png' },
    { category_id: 1, name: '3 Chicken Strips', description: 'Tender chicken strips with crispy coating', price: 169, prep_time_minutes: 15, image_url: '/images/food/3-chicken-strips.png' },

    // Pizza (category_id: 2)
    { category_id: 2, name: 'Fried Chicken Pizza', description: 'Pizza topped with crispy fried chicken and special sauce', price: 299, is_featured: 1, prep_time_minutes: 25, image_url: '/images/food/fried-chicken-pizza.png' },
    { category_id: 2, name: 'Loaded Chicken Pizza', description: 'Loaded with chicken, peppers, onions, and cheese', price: 349, prep_time_minutes: 25, image_url: '/images/food/loaded-chicken-pizza.png' },
    { category_id: 2, name: 'Tandoori Tikka Pizza', description: 'Tandoori chicken tikka with mint mayo', price: 329, prep_time_minutes: 25, image_url: '/images/food/tandoori-tikka-pizza.png' },
    { category_id: 2, name: 'Paneer Pizza', description: 'Cottage cheese with bell peppers and onions', price: 279, is_vegetarian: 1, prep_time_minutes: 25, image_url: '/images/food/paneer-pizza.png' },
    { category_id: 2, name: 'Veg Supreme Pizza', description: 'Loaded with fresh vegetables and cheese', price: 269, is_vegetarian: 1, prep_time_minutes: 25, image_url: '/images/food/veg-supreme-pizza.png' },

    // Family Combo (category_id: 3)
    { category_id: 3, name: 'Family Feast', description: '8 pcs chicken, 2 large fries, 4 drinks, 4 dips', price: 899, is_featured: 1, prep_time_minutes: 35, image_url: '/images/food/family-feast.png' },
    { category_id: 3, name: 'Super Family Combo', description: '12 pcs chicken, 3 large fries, 6 drinks, 6 dips', price: 1299, prep_time_minutes: 40, image_url: '/images/food/super-family-combo.png' },

    // Burger (category_id: 4)
    { category_id: 4, name: 'Zinger Burger', description: 'Crispy chicken fillet with lettuce and mayo', price: 179, is_featured: 1, prep_time_minutes: 15, image_url: '/images/food/zinger-burger.png' },
    { category_id: 4, name: 'Mini Chicken Burger', description: 'Small but mighty chicken burger', price: 99, prep_time_minutes: 10, image_url: '/images/food/mini-chicken-burger.png' },
    { category_id: 4, name: 'Paneer Burger', description: 'Crispy paneer patty with fresh veggies', price: 149, is_vegetarian: 1, prep_time_minutes: 12, image_url: '/images/food/paneer-burger.png' },
    { category_id: 4, name: 'Veg Burger', description: 'Classic veggie patty with fresh toppings', price: 99, is_vegetarian: 1, prep_time_minutes: 10 },
    { category_id: 4, name: 'Aloo Tikki Burger', description: 'Spiced potato patty with tangy sauce', price: 89, is_vegetarian: 1, prep_time_minutes: 10 },
    { category_id: 4, name: 'Grilled Chicken Burger', description: 'Grilled chicken breast with herbs', price: 199, prep_time_minutes: 15 },
    { category_id: 4, name: 'Maharaja Tower Burger', description: 'Double patty stacked high with all toppings', price: 249, is_featured: 1, prep_time_minutes: 18 },

    // Shawarma (category_id: 5)
    { category_id: 5, name: 'Fried Chicken Shawarma', description: 'Crispy chicken with garlic sauce in pita', price: 149, prep_time_minutes: 12 },
    { category_id: 5, name: 'Cheese Chicken Shawarma', description: 'Chicken shawarma loaded with melted cheese', price: 179, is_featured: 1, prep_time_minutes: 15 },
    { category_id: 5, name: 'Veg Shawarma', description: 'Fresh vegetables with hummus in pita', price: 119, is_vegetarian: 1, prep_time_minutes: 10 },
    { category_id: 5, name: 'Paneer Shawarma', description: 'Grilled paneer with special spices', price: 149, is_vegetarian: 1, prep_time_minutes: 12 },

    // Sandwich (category_id: 6)
    { category_id: 6, name: 'Fried Chicken Sandwich', description: 'Crispy chicken with mayo and lettuce', price: 159, prep_time_minutes: 12 },
    { category_id: 6, name: 'Tandoori Chicken Sandwich', description: 'Tandoori chicken with mint chutney', price: 179, prep_time_minutes: 15 },
    { category_id: 6, name: 'Cheese Corn Sandwich', description: 'Sweet corn and cheese grilled sandwich', price: 129, is_vegetarian: 1, prep_time_minutes: 10 },
    { category_id: 6, name: 'Veg Grilled Sandwich', description: 'Fresh veggies grilled to perfection', price: 109, is_vegetarian: 1, prep_time_minutes: 10 },
    { category_id: 6, name: 'Paneer Grilled Sandwich', description: 'Spiced paneer with vegetables', price: 139, is_vegetarian: 1, prep_time_minutes: 12 },

    // Wraps (category_id: 7)
    { category_id: 7, name: 'Chicken Twister Wrap', description: 'Crispy chicken strips in a tortilla wrap', price: 169, is_featured: 1, prep_time_minutes: 12 },
    { category_id: 7, name: 'Paneer Wrap', description: 'Grilled paneer with fresh vegetables', price: 149, is_vegetarian: 1, prep_time_minutes: 12 },
    { category_id: 7, name: 'Veg Wrap', description: 'Assorted vegetables with special sauce', price: 129, is_vegetarian: 1, prep_time_minutes: 10 },

    // Veg Snackup (category_id: 8)
    { category_id: 8, name: 'French Fries', description: 'Golden crispy fries', price: 89, is_vegetarian: 1, prep_time_minutes: 8 },
    { category_id: 8, name: 'Peri Peri Fries', description: 'Fries tossed in peri peri seasoning', price: 109, is_vegetarian: 1, prep_time_minutes: 10 },
    { category_id: 8, name: 'Veg Pops', description: 'Crispy vegetable bites', price: 119, is_vegetarian: 1, prep_time_minutes: 10 },
    { category_id: 8, name: 'Veg Nuggets', description: 'Golden veggie nuggets', price: 129, is_vegetarian: 1, prep_time_minutes: 10 },
    { category_id: 8, name: 'Veg Fingers', description: 'Crispy vegetable fingers', price: 119, is_vegetarian: 1, prep_time_minutes: 10 },

    // Non Veg Snackup (category_id: 9)
    { category_id: 9, name: 'Cheese Shots', description: 'Cheesy chicken bites', price: 149, prep_time_minutes: 12 },
    { category_id: 9, name: 'Chicken Nuggets', description: 'Crispy chicken nuggets', price: 159, is_featured: 1, prep_time_minutes: 10 },
    { category_id: 9, name: 'Chicken Fingers', description: 'Tender chicken fingers', price: 169, prep_time_minutes: 12 },

    // Kids Special Pizza (category_id: 10)
    { category_id: 10, name: 'Mini Cheese Pizza', description: 'Small pizza with extra cheese', price: 149, is_vegetarian: 1, prep_time_minutes: 15 },
    { category_id: 10, name: 'Mini Chicken Pizza', description: 'Small pizza with chicken toppings', price: 179, prep_time_minutes: 15 },
    { category_id: 10, name: 'Mini Veggie Pizza', description: 'Small pizza with fresh vegetables', price: 149, is_vegetarian: 1, prep_time_minutes: 15 },
    { category_id: 10, name: 'Cheese Burst Mini', description: 'Mini pizza with cheese burst crust', price: 199, is_vegetarian: 1, prep_time_minutes: 18 },
    { category_id: 10, name: 'Pepperoni Mini', description: 'Mini pizza with pepperoni', price: 189, prep_time_minutes: 15 },
    { category_id: 10, name: 'BBQ Chicken Mini', description: 'Mini pizza with BBQ chicken', price: 199, prep_time_minutes: 18 },

    // Buddy Meals (category_id: 11)
    { category_id: 11, name: 'Buddy Zinger Meal', description: '2 Zinger burgers, 2 fries, 2 drinks', price: 449, prep_time_minutes: 20 },
    { category_id: 11, name: 'Buddy Chicken Meal', description: '4 pcs chicken, 2 fries, 2 drinks, 2 dips', price: 549, prep_time_minutes: 25 },
    { category_id: 11, name: 'Buddy Mix Meal', description: '2 burgers, 2 wraps, 2 fries, 2 drinks', price: 649, is_featured: 1, prep_time_minutes: 25 },

    // Dips (category_id: 12)
    { category_id: 12, name: 'Garlic Mayo Dip', description: 'Creamy garlic mayonnaise', price: 29, is_vegetarian: 1, prep_time_minutes: 1 },
    { category_id: 12, name: 'Veg Mayo Dip', description: 'Classic vegetarian mayo', price: 25, is_vegetarian: 1, prep_time_minutes: 1 },
    { category_id: 12, name: 'Cheese Dip', description: 'Rich and creamy cheese sauce', price: 39, is_vegetarian: 1, prep_time_minutes: 1 },
    { category_id: 12, name: 'Hot Mayo Dip', description: 'Spicy mayo for heat lovers', price: 29, is_vegetarian: 1, prep_time_minutes: 1 }
  ];

  const insertMenuItem = db.prepare(`
    INSERT INTO menu_items (category_id, name, description, price, is_vegetarian, is_featured, prep_time_minutes, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  menuItems.forEach(item => {
    insertMenuItem.run(
      item.category_id,
      item.name,
      item.description,
      item.price,
      item.is_vegetarian || 0,
      item.is_featured || 0,
      item.prep_time_minutes || 15,
      item.image_url || null
    );
  });

  // Seed discount codes
  const discounts = [
    { code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_order_amount: 200, max_discount_amount: 100 },
    { code: 'FLAT50', discount_type: 'fixed', discount_value: 50, min_order_amount: 300 },
    { code: 'AXISREWARDS', discount_type: 'fixed', discount_value: 150, min_order_amount: 500 }
  ];

  const insertDiscount = db.prepare(`
    INSERT INTO discounts (code, discount_type, discount_value, min_order_amount, max_discount_amount)
    VALUES (?, ?, ?, ?, ?)
  `);
  discounts.forEach(disc => {
    insertDiscount.run(disc.code, disc.discount_type, disc.discount_value, disc.min_order_amount, disc.max_discount_amount || null);
  });

  // Seed a test user
  const passwordHash = await bcrypt.hash('password123', 10);
  const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, phone, reward_points) VALUES (?, ?, ?, ?, ?)');
  insertUser.run('Test User', 'test@example.com', passwordHash, '9876543210', 250);

  console.log('Database seeded successfully!');
  console.log('Test user: test@example.com / password123');
}

seedDatabase().catch(console.error);
