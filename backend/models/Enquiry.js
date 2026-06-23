const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  subject: { type: String },
  message: { type: String },
  source: { type: String, enum: ['Website Enquiry', 'Callback Request', 'WhatsApp Lead', 'Contact Form Lead'], default: 'Website Enquiry' },
  status: { type: String, enum: ['Pending', 'Contacted', 'Resolved'], default: 'Pending' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', EnquirySchema);
