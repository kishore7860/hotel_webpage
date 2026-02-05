import db from '../config/database.js';

export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      reward_points INTEGER DEFAULT 0,
      total_orders INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Menu items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      is_vegetarian INTEGER DEFAULT 0,
      is_vegan INTEGER DEFAULT 0,
      is_gluten_free INTEGER DEFAULT 0,
      spice_level INTEGER DEFAULT 0,
      prep_time_minutes INTEGER DEFAULT 15,
      is_available INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Discounts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS discounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
      discount_value REAL NOT NULL,
      min_order_amount REAL DEFAULT 0,
      max_discount_amount REAL,
      usage_limit INTEGER,
      times_used INTEGER DEFAULT 0,
      valid_from DATETIME,
      valid_until DATETIME,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      table_number TEXT,
      delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'carryout')),
      subtotal REAL NOT NULL,
      discount_id INTEGER,
      discount_amount REAL DEFAULT 0,
      points_earned INTEGER DEFAULT 0,
      points_redeemed INTEGER DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
      estimated_ready_time DATETIME,
      payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (discount_id) REFERENCES discounts(id)
    )
  `);

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      item_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      special_instructions TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    )
  `);

  // Reward transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reward_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      order_id INTEGER,
      points INTEGER NOT NULL,
      transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed')),
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  console.log('Database initialized successfully');
}

export default initializeDatabase;
