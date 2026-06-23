const express = require('express');
const router = express.Router();
const { estimateFare, createBooking, getBookings, getBookingById, updateBooking, cancelBooking, getInvoice, deleteBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/estimate', estimateFare);
router.post('/', createBooking);
router.get('/', protect, authorize('Admin', 'Manager'), getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, authorize('Admin', 'Manager', 'Driver'), updateBooking);
router.put('/:id/cancel', cancelBooking);
router.get('/:id/invoice', getInvoice);
router.delete('/:id', protect, authorize('Admin'), deleteBooking);

module.exports = router;
