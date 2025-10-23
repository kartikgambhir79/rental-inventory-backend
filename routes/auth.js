
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// configurable admin secret to allow creating admin via register (optional)
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

router.post('/register', async (req,res)=>{
  try{
    const { name, email, password, role, adminSecret } = req.body;
    if(!email || !password) return res.status(400).json({ message:'email and password required' });
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ message:'User exists' });
    // prevent creating admin without admin secret
    let finalRole = 'customer';
    if(role && role.toLowerCase() === 'admin') {
      if(adminSecret !== ADMIN_SECRET || !ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret' });
      }
      finalRole = 'admin';
    } else {
      finalRole = 'customer';
    }
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, password:hash, role: finalRole });
    const token = jwt.sign({ id: u._id, email: u.email, name: u.name, role: u.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn:'7d' });
    res.json({ token, user: { id: u._id, email:u.email, name:u.name, role: u.role } });
  }catch(e){
    console.error(e);
    res.status(500).json({ message:'Server error' });
  }
});

router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if(!u) return res.status(400).json({ message:'Invalid credentials' });
    const ok = await bcrypt.compare(password, u.password);
    if(!ok) return res.status(400).json({ message:'Invalid credentials' });
    const token = jwt.sign({ id: u._id, email: u.email, name: u.name, role: u.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn:'7d' });
    res.json({ token, user: { id: u._id, email:u.email, name:u.name, role: u.role } });
  }catch(e){
    console.error(e);
    res.status(500).json({ message:'Server error' });
  }
});

export default router;
