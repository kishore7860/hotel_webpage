import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${random}`;
}

export function createOrder(req, res, next) {
  try {
    const {
      items,
      customer_name,
      customer_phone,
      table_number,
      delivery_type,
      discount_code,
      points_to_redeem
    } = req.body;

    if (!items || !items.length) {
      return next(new AppError('Order must have at least one item', 400));
    }

    if (!customer_name || !customer_phone) {
      return next(new AppError('Customer name and phone are required', 400));
    }

    if (!delivery_type || !['pickup', 'carryout'].includes(delivery_type)) {
      return next(new AppError('Delivery type must be pickup or carryout', 400));
    }

    if (delivery_type === 'carryout' && !table_number) {
      return next(new AppError('Table number is required for carryout', 400));
    }

    // Calculate subtotal and validate items
    let subtotal = 0;
    let maxPrepTime = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = db.prepare('SELECT * FROM menu_items WHERE id = ? AND is_available = 1').get(item.menu_item_id);
      if (!menuItem) {
        return next(new AppError(`Item with id ${item.menu_item_id} not found or unavailable`, 400));
      }

      const quantity = item.quantity || 1;
      const itemSubtotal = menuItem.price * quantity;
      subtotal += itemSubtotal;
      maxPrepTime = Math.max(maxPrepTime, menuItem.prep_time_minutes);

      orderItems.push({
        menu_item_id: menuItem.id,
        item_name: menuItem.name,
        item_price: menuItem.price,
        quantity,
        subtotal: itemSubtotal,
        special_instructions: item.special_instructions || null
      });
    }

    // Apply discount
    let discountId = null;
    let discountAmount = 0;

    if (discount_code) {
      const discount = db.prepare(`
        SELECT * FROM discounts
        WHERE code = ? AND is_active = 1
        AND (valid_from IS NULL OR valid_from <= datetime('now'))
        AND (valid_until IS NULL OR valid_until >= datetime('now'))
        AND (usage_limit IS NULL OR times_used < usage_limit)
      `).get(discount_code);

      if (discount) {
        if (subtotal >= discount.min_order_amount) {
          if (discount.discount_type === 'percentage') {
            discountAmount = (subtotal * discount.discount_value) / 100;
            if (discount.max_discount_amount) {
              discountAmount = Math.min(discountAmount, discount.max_discount_amount);
            }
          } else {
            discountAmount = discount.discount_value;
          }
          discountId = discount.id;
          db.prepare('UPDATE discounts SET times_used = times_used + 1 WHERE id = ?').run(discount.id);
        }
      }
    }

    // Apply points redemption
    let pointsRedeemed = 0;
    let pointsDiscount = 0;
    const userId = req.user?.id || null;

    if (points_to_redeem && userId) {
      const user = db.prepare('SELECT reward_points FROM users WHERE id = ?').get(userId);
      if (user && user.reward_points >= points_to_redeem) {
        pointsRedeemed = Math.min(points_to_redeem, user.reward_points);
        pointsDiscount = Math.floor(pointsRedeemed / 10); // 100 points = ₹10
        db.prepare('UPDATE users SET reward_points = reward_points - ? WHERE id = ?').run(pointsRedeemed, userId);
      }
    }

    // Calculate tax and total
    const taxRate = 0.08;
    const afterDiscount = subtotal - discountAmount - pointsDiscount;
    const taxAmount = Math.round(afterDiscount * taxRate * 100) / 100;
    const totalAmount = Math.round((afterDiscount + taxAmount) * 100) / 100;

    // Calculate points earned (1 point per ₹10)
    const pointsEarned = userId ? Math.floor(totalAmount / 10) : 0;

    // Generate order number and estimated time
    const orderNumber = generateOrderNumber();
    const estimatedReadyTime = new Date(Date.now() + (maxPrepTime + 5) * 60000).toISOString();

    // Create order
    const orderResult = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_phone, table_number,
        delivery_type, subtotal, discount_id, discount_amount, points_earned,
        points_redeemed, tax_amount, total_amount, status, estimated_ready_time, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, 'paid')
    `).run(
      orderNumber, userId, customer_name, customer_phone, table_number || null,
      delivery_type, subtotal, discountId, discountAmount + pointsDiscount, pointsEarned,
      pointsRedeemed, taxAmount, totalAmount, estimatedReadyTime
    );

    const orderId = orderResult.lastInsertRowid;

    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity, subtotal, special_instructions)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of orderItems) {
      insertItem.run(orderId, item.menu_item_id, item.item_name, item.item_price, item.quantity, item.subtotal, item.special_instructions);
    }

    // Credit reward points to user
    if (userId && pointsEarned > 0) {
      db.prepare('UPDATE users SET reward_points = reward_points + ?, total_orders = total_orders + 1 WHERE id = ?').run(pointsEarned, userId);
      db.prepare(`
        INSERT INTO reward_transactions (user_id, order_id, points, transaction_type, description)
        VALUES (?, ?, ?, 'earned', ?)
      `).run(userId, orderId, pointsEarned, `Earned from order ${orderNumber}`);
    }

    // Record points redemption transaction
    if (pointsRedeemed > 0) {
      db.prepare(`
        INSERT INTO reward_transactions (user_id, order_id, points, transaction_type, description)
        VALUES (?, ?, ?, 'redeemed', ?)
      `).run(userId, orderId, -pointsRedeemed, `Redeemed for order ${orderNumber}`);
    }

    res.status(201).json({
      success: true,
      data: {
        order: {
          order_number: orderNumber,
          subtotal,
          discount_amount: discountAmount + pointsDiscount,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          points_earned: pointsEarned,
          points_redeemed: pointsRedeemed,
          estimated_ready_time: estimatedReadyTime,
          delivery_type,
          status: 'confirmed'
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export function getOrderByNumber(req, res, next) {
  const orderNumber = req.params.orderNumber;

  const order = db.prepare(`
    SELECT o.*, d.code as discount_code
    FROM orders o
    LEFT JOIN discounts d ON o.discount_id = d.id
    WHERE o.order_number = ?
  `).get(orderNumber);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

  res.json({
    success: true,
    data: {
      order: {
        ...order,
        items
      }
    }
  });
}

export function getMyOrders(req, res, next) {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const orders = db.prepare(`
    SELECT o.*, d.code as discount_code
    FROM orders o
    LEFT JOIN discounts d ON o.discount_id = d.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `).all(req.user.id);

  const ordersWithItems = orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    return { ...order, items };
  });

  res.json({
    success: true,
    data: { orders: ordersWithItems }
  });
}
