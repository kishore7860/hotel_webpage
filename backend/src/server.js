import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import rewardsRoutes from './routes/rewardsRoutes.js';
import discountRoutes from './routes/discountRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import initializeDatabase from './database/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Restaurant info endpoint
app.get('/api/v1/restaurant', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Star Chicken',
      rating: 4.2,
      total_ratings: 46,
      location: 'New BusStand, Shop No: Room no-13, NEW RTC BUSSTAND COMPLEX, NAGARAJUPET',
      fssai_license: '20125232000486',
      prep_time: '30-35 mins',
      currency: 'INR',
      currency_symbol: '₹'
    }
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', menuRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/rewards', rewardsRoutes);
app.use('/api/v1/discounts', discountRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
});
