import express from 'express';
import Setting from '../models/Setting.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req,res)=>{
  const all = await Setting.find();
  const obj = {};
  all.forEach(s=> obj[s.key]=s.value);
  res.json(obj);
});
router.post('/', auth, async (req,res)=>{
  const data = req.body || {};
  const promises = Object.keys(data).map(async (k)=>{
    return Setting.findOneAndUpdate({ key:k }, { key:k, value:data[k] }, { upsert:true, new:true });
  });
  await Promise.all(promises);
  res.json({ ok:true });
});

export default router;
