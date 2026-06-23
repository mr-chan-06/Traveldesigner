const express = require('express');
const router = express.Router();
const { getEnquiries, createEnquiry, updateEnquiry, deleteEnquiry } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin', 'Manager'), getEnquiries);
router.post('/', createEnquiry);
router.put('/:id', protect, authorize('Admin', 'Manager'), updateEnquiry);
router.delete('/:id', protect, authorize('Admin'), deleteEnquiry);

module.exports = router;
