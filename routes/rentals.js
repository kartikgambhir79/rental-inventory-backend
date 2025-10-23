import express from 'express';
import Rental from '../models/Rental.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const all = await Rental.find().populate('item').populate('customer').sort({ createdAt: -1 });
  res.json(all);
});
router.post('/', auth, async (req, res) => {
  const { customerId, itemId, qty, deposit, dueOn } = req.body;
  const customer = await User.findById(customerId);
  const item = await Item.findById(itemId);
  if (!customer || !item) return res.status(400).json({ message: 'Invalid customer or item' });
  if (item.qty < qty) return res.status(400).json({ message: 'Not enough qty' });
  item.qty = item.qty - qty;
  await item.save();
  const r = await Rental.create({ customer: customer._id, item: item._id, sku: item.sku, qty, deposit, dueOn });
  res.json(r);
});
router.post('/:id/return', auth, async (req, res) => {
  const r = await Rental.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  if (r.status === 'returned') return res.json(r);
  r.status = 'returned'; r.returnedOn = new Date();
  await r.save();
  const item = await Item.findById(r.item);
  if (item) {
    item.qty = (item.qty || 0) + r.qty;
    await item.save();
  }
  res.json(r);
});

export default router;
