import User from '../models/user.js';
import bctyptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Query } from 'mongoose';
dotenv.config();
export const Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ error: 'Email is already taken' });
    }
    const existedUsername = await User.findOne({ username });
    if (existedUsername) {
      return res.status(400).json({ error: 'Username is already taken' });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be atleast 8 characters' });
    }
    const hashedPassword = bctyptjs.hashSync(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    const { password: pass, ...other } = newUser._doc; //rest operator
    res.status(201).json(other); // sends user data without password
  } catch (error) {
    console.log('error is signup controller', error);
  }
};

export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'all fileds are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const isPasswordCorrect = await bctyptjs.compareSync(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const { password: pass, ...others } = user._doc;
    console.log(user);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token).status(200).json(others);
    console.log(process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async (req, res) => {
  try {
    console.log(req.user);
    const me = await User.findById(req.user._id);
    console.log(me);
    res.status(200).json(me);
  } catch (error) {}
};

// const signin = async () => {
//   const user = await User.findById(req.user.id);
// };
