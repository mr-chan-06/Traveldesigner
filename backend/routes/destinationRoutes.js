const express = require('express');
const router = express.Router();
const { getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination } = require('../controllers/destinationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.post('/', protect, authorize('Admin', 'Manager'), createDestination);
router.put('/:id', protect, authorize('Admin', 'Manager'), updateDestination);
router.delete('/:id', protect, authorize('Admin'), deleteDestination);

module.exports = router;
