const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  bookingType: { type: String, enum: ['Local City Rides', 'Airport Transfers', 'Outstation Trips', 'One-Way Taxi', 'Round Trip Taxi', 'Tour Package'], default: 'One-Way Taxi' },
  dateTime: { type: Date, required: true },
  returnDateTime: { type: Date },
  passengers: { type: Number, required: true, default: 1 },
  vehicleCategory: { type: String, required: true },
  vehicleAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driverAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    secondaryPhone: { type: String }
  },
  estimatedFare: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  paymentId: { type: String },
  status: { type: String, enum: ['Pending', 'Assigned', 'Completed', 'Cancelled'], default: 'Pending' },
  invoiceNumber: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
