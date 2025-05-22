import express from 'express';
import { Signin, Signup, getMe } from '../controllers/user.js';
import { VerifyUser } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/signup', Signup);
router.get('/signin', Signin);
router.get('/me', VerifyUser, getMe);

export default router;
