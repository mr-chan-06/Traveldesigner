const express = require('express');
const router = express.Router();
const { getVehicles, getVehicleById, createVehicle, updateVehicle, addMaintenanceRecord, deleteVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', protect, authorize('Admin', 'Manager'), createVehicle);
router.put('/:id', protect, authorize('Admin', 'Manager'), updateVehicle);
router.post('/:id/maintenance', protect, authorize('Admin', 'Manager'), addMaintenanceRecord);
router.delete('/:id', protect, authorize('Admin'), deleteVehicle);

module.exports = router;
