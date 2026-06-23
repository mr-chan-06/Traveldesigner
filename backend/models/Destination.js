const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, enum: ['Tamil Nadu', 'Kerala', 'Karnataka'], required: true },
  image: { type: String },
  description: { type: String, required: true },
  distance: { type: String }, // e.g. "290 km"
  estimatedFare: { type: Number }, // e.g. 4500
  popularSpots: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);
