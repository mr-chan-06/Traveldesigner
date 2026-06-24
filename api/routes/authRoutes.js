const express = require('express');
const router = express.Router();
const { login, register, getProfile, getDrivers, getUsers, updateUserProfile, deleteUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', protect, authorize('Admin', 'Manager'), register);
router.get('/profile', protect, getProfile);
router.get('/drivers', protect, getDrivers);
router.get('/users', protect, authorize('Admin', 'Manager'), getUsers);
router.put('/users/:id', protect, authorize('Admin', 'Manager'), updateUserProfile);
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
