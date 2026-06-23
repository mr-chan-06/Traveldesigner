const mongoose = require('mongoose');

const TourPackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Ooty Package', 'Kerala Package', 'Karnataka Package', 'South India Package', 'Customized Tour Package'], required: true },
  duration: { type: String, required: true }, // e.g. "3 Days / 2 Nights"
  placesCovered: [{ type: String }],
  vehicleCategory: { type: String, required: true }, // e.g. "Sedan" or "SUV"
  accommodation: { type: Boolean, default: false },
  price: { type: Number, required: true },
  description: { type: String },
  highlights: [{ type: String }],
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TourPackage', TourPackageSchema);
