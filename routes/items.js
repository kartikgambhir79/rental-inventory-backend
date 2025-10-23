import express from 'express';
import Item from '../models/Item.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req,res)=>{
  const items = await Item.find().sort({createdAt:-1});
  res.json(items);
});
router.get('/:id', async (req,res)=>{
  const it = await Item.findById(req.params.id);
  if(!it) return res.status(404).json({ message:'Not found' });
  res.json(it);
});
router.post('/', auth, async (req,res)=>{
  const data = req.body;
  const it = await Item.create(data);
  res.json(it);
});
router.put('/:id', auth, async (req,res)=>{
  const it = await Item.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(it);
});
router.delete('/:id', auth, async (req,res)=>{
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

export default router;
