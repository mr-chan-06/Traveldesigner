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
    const payload = {
      name: req.body.name,
      category: req.body.category,
      duration: req.body.duration,
      placesCovered: Array.isArray(req.body.placesCovered)
        ? req.body.placesCovered
        : typeof req.body.placesCovered === 'string'
          ? req.body.placesCovered.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      vehicleCategory: req.body.vehicleCategory,
      accommodation: req.body.accommodation === true || req.body.accommodation === 'true',
      price: Number(req.body.price || 0),
      description: req.body.description,
      highlights: Array.isArray(req.body.highlights)
        ? req.body.highlights
        : typeof req.body.highlights === 'string'
          ? req.body.highlights.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      image: req.body.image
    };

    const tourPackage = await dataService.packages.create(payload);
    res.status(201).json({ success: true, data: tourPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      category: req.body.category,
      duration: req.body.duration,
      placesCovered: Array.isArray(req.body.placesCovered)
        ? req.body.placesCovered
        : typeof req.body.placesCovered === 'string'
          ? req.body.placesCovered.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      vehicleCategory: req.body.vehicleCategory,
      accommodation: req.body.accommodation === true || req.body.accommodation === 'true',
      price: Number(req.body.price || 0),
      description: req.body.description,
      highlights: Array.isArray(req.body.highlights)
        ? req.body.highlights
        : typeof req.body.highlights === 'string'
          ? req.body.highlights.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      image: req.body.image
    };

    const tourPackage = await dataService.packages.findByIdAndUpdate(req.params.id, payload, { new: true });
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
