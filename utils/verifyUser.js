import User from '../models/user.js';
import jwt from 'jsonwebtoken';
export const VerifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ error: 'cookie not found' });
    }
    const JwtVerify = jwt.verify(token, process.env.JWT_SECRET);
    if (!JwtVerify) {
      return res.status(400).json({ error: 'You are not authorized.' });
    }
    const user = await User.findById(JwtVerify.id).select('-password');
    req.user = user;
    next();
  } catch (error) {
    console.log(error, 'error in the verify middleware');
  }
};
