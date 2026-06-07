const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

module.exports = router;
