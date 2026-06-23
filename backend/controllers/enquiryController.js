const dataService = require('../config/dataService');
const { sendSMS, sendWhatsApp } = require('../services/notificationService');

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await dataService.enquiries.find({});
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEnquiry = async (req, res) => {
  try {
    const enquiry = await dataService.enquiries.create(req.body);
    
    // Send auto notification on callback/whatsapp lead
    if (req.body.source === 'Callback Request') {
      const msg = `Ooty Travels: Received callback request from ${req.body.name || 'User'} (${req.body.phone}). We will contact you shortly.`;
      await sendSMS(req.body.phone, msg);
    } else if (req.body.source === 'WhatsApp Lead') {
      const msg = `Ooty Travels: Hello ${req.body.name || 'User'}, thank you for reaching out via WhatsApp. Our team will assist you shortly.`;
      await sendWhatsApp(req.body.phone, msg);
    }

    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await dataService.enquiries.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    await dataService.enquiries.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEnquiries, createEnquiry, updateEnquiry, deleteEnquiry };
