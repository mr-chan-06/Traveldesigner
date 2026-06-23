const mongoose = require('mongoose');

const MaintenanceRecordSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  cost: { type: Number, required: true }
});

const VehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Sedan', 'Hatchback', 'SUV', 'Innova Crysta', 'Tempo Traveller', 'Luxury Vehicles'], 
    required: true 
  },
  seatingCapacity: { type: Number, required: true },
  luggageCapacity: { type: Number, required: true },
  acType: { type: String, enum: ['AC', 'Non-AC'], default: 'AC' },
  pricePerKm: { type: Number, required: true },
  plateNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Available', 'On Trip', 'Maintenance'], default: 'Available' },
  image: { type: String },
  maintenanceRecords: [MaintenanceRecordSchema]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
