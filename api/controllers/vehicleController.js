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
      name: String(req.body.name || '').trim(),
      category: String(req.body.category || 'Sedan').trim(),
      seatingCapacity: Number(req.body.seatingCapacity || 0),
      luggageCapacity: Number(req.body.luggageCapacity || 0),
      acType: String(req.body.acType || 'AC').trim(),
      pricePerKm: Number(req.body.pricePerKm || 0),
      plateNumber: String(req.body.plateNumber || '').trim().toUpperCase(),
      image: req.body.image || '',
      status: String(req.body.status || 'Available').trim(),
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
    const payload = {
      name: req.body.name !== undefined ? String(req.body.name).trim() : undefined,
      category: req.body.category !== undefined ? String(req.body.category).trim() : undefined,
      seatingCapacity: req.body.seatingCapacity !== undefined ? Number(req.body.seatingCapacity) : undefined,
      luggageCapacity: req.body.luggageCapacity !== undefined ? Number(req.body.luggageCapacity) : undefined,
      acType: req.body.acType !== undefined ? String(req.body.acType).trim() : undefined,
      pricePerKm: req.body.pricePerKm !== undefined ? Number(req.body.pricePerKm) : undefined,
      plateNumber: req.body.plateNumber !== undefined ? String(req.body.plateNumber).trim().toUpperCase() : undefined,
      image: req.body.image !== undefined ? req.body.image : undefined,
      status: req.body.status !== undefined ? String(req.body.status).trim() : undefined,
      maintenanceRecords: req.body.maintenanceRecords !== undefined ? (Array.isArray(req.body.maintenanceRecords) ? req.body.maintenanceRecords : []) : undefined
    };

    const sanitizedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const vehicle = await dataService.vehicles.findByIdAndUpdate(req.params.id, sanitizedPayload, { new: true });
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
