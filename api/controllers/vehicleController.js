const dataService = require('../config/dataService');

const getVehicles = async (req, res) => {
  try {
    const vehicles = await dataService.vehicles.find({});
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await dataService.vehicles.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVehicle = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      category: req.body.category,
      seatingCapacity: Number(req.body.seatingCapacity || 0),
      luggageCapacity: Number(req.body.luggageCapacity || 0),
      acType: req.body.acType || 'AC',
      pricePerKm: Number(req.body.pricePerKm || 0),
      plateNumber: req.body.plateNumber,
      image: req.body.image,
      status: req.body.status || 'Available',
      maintenanceRecords: Array.isArray(req.body.maintenanceRecords) ? req.body.maintenanceRecords : []
    };

    const vehicle = await dataService.vehicles.create(payload);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await dataService.vehicles.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addMaintenanceRecord = async (req, res) => {
  try {
    const vehicle = await dataService.vehicles.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    const record = {
      date: req.body.date || new Date(),
      description: req.body.description,
      cost: req.body.cost
    };
    
    // Add to maintenance records
    const records = vehicle.maintenanceRecords || [];
    records.push(record);
    
    const updated = await dataService.vehicles.findByIdAndUpdate(req.params.id, {
      maintenanceRecords: records
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    await dataService.vehicles.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, addMaintenanceRecord, deleteVehicle };
