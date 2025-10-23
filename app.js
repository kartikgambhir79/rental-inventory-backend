import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import customersRoutes from './routes/customers.js';
import rentalsRoutes from './routes/rentals.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/settings', settingsRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('-------------------------------');
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
    console.log('-------------------------------');

  })
  .catch(err => {
    console.error('Mongo connection error', err.message);
  });
