import { Router } from 'express';
import { register, login, getProfile, updateProfile, updateMasterResume } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/master-resume', protect, updateMasterResume);

export default router;
