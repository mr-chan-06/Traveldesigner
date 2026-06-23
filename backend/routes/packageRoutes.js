const express = require('express');
const router = express.Router();
const { getPackages, getPackageById, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/', protect, authorize('Admin', 'Manager'), createPackage);
router.put('/:id', protect, authorize('Admin', 'Manager'), updatePackage);
router.delete('/:id', protect, authorize('Admin'), deletePackage);

module.exports = router;
