const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') return;
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ooty_travels';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    
    // Seed MongoDB collections with default platform items if empty
    const dataService = require('./dataService');
    await dataService.seedMongoDB();
  } catch (error) {
    console.warn(`Database Connection Warning: Mongoose failed to connect to database (${error.message}).`);
    console.warn('Backend will run in resilient local in-memory fallback mode. Bookings, drivers, and vehicles changes will persist in memory for this session.');
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
