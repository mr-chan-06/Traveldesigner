const dataService = require('../config/dataService');

const getDestinations = async (req, res) => {
  try {
    const destinations = await dataService.destinations.find({});
    res.status(200).json({ success: true, count: destinations.length, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDestinationById = async (req, res) => {
  try {
    const destination = await dataService.destinations.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDestination = async (req, res) => {
  try {
    const destination = await dataService.destinations.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDestination = async (req, res) => {
  try {
    const destination = await dataService.destinations.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDestination = async (req, res) => {
  try {
    await dataService.destinations.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination };
