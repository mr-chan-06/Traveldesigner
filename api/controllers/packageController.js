const dataService = require('../config/dataService');

const getPackages = async (req, res) => {
  try {
    const packages = await dataService.packages.find({});
    res.status(200).json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPackageById = async (req, res) => {
  try {
    const tourPackage = await dataService.packages.findById(req.params.id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.status(200).json({ success: true, data: tourPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPackage = async (req, res) => {
  try {
    const tourPackage = await dataService.packages.create(req.body);
    res.status(201).json({ success: true, data: tourPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const tourPackage = await dataService.packages.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: tourPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    await dataService.packages.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPackages, getPackageById, createPackage, updatePackage, deletePackage };
