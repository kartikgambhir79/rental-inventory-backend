import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function auth(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  }catch(e){
    return res.status(401).json({ message: 'Invalid token' });
  }
}
