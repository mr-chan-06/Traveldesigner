const dataService = require('../config/dataService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'ootytravelssecret12345',
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'ootytravelsrefreshsecret67890',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const user = await dataService.users.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    let isMatch = false;
    if (user.matchPassword) {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register User (Manager / Driver created by Admin)
const register = async (req, res) => {
  const { name, email, password, role, phone, licenseNumber, vehicleAssigned } = req.body;
  try {
    const userExists = await dataService.users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const payload = {
      name,
      email,
      password,
      role: role || 'Driver',
      phone,
      licenseNumber,
      vehicleAssigned,
      status: 'Available'
    };

    const newUser = await dataService.users.create(payload);

    res.status(201).json({
      success: true,
      message: `${payload.role} created successfully`,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get profile
const getProfile = async (req, res) => {
  try {
    const user = await dataService.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        licenseNumber: user.licenseNumber,
        vehicleAssigned: user.vehicleAssigned
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Drivers
const getDrivers = async (req, res) => {
  try {
    const drivers = await dataService.users.find({ role: 'Driver' });
    res.status(200).json({ success: true, count: drivers.length, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Users (Admin / Managers / Drivers)
const getUsers = async (req, res) => {
  try {
    const users = await dataService.users.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Driver Status / Details
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, status, licenseNumber, vehicleAssigned } = req.body;
    const updated = await dataService.users.findByIdAndUpdate(req.params.id, {
      name, phone, status, licenseNumber, vehicleAssigned
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    await dataService.users.delete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, register, getProfile, getDrivers, getUsers, updateUserProfile, deleteUser };
