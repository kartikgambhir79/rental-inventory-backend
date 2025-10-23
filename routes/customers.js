import express from 'express';
import Customer from '../models/Customer.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req,res)=>{
  const all = await Customer.find().sort({createdAt:-1});
  res.json(all);
});
router.post('/', auth, async (req,res)=>{
  const c = await Customer.create(req.body);
  res.json(c);
});
router.put('/:id', auth, async (req,res)=>{
  const c = await Customer.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(c);
});
export default router;
