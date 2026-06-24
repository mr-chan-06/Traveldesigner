const dataService = require('../config/dataService');
const { sendSMS, sendWhatsApp, sendEmail } = require('../services/notificationService');
const { generateInvoicePDF } = require('../services/pdfService');

// Distance Lookup Table for Tamil Nadu, Kerala, Karnataka routes
const DISTANCE_MATRIX = {
  'ooty-coimbatore': 85,
  'coimbatore-ooty': 85,
  'ooty-bangalore': 270,
  'bangalore-ooty': 270,
  'ooty-mysore': 125,
  'mysore-ooty': 125,
  'ooty-munnar': 240,
  'munnar-ooty': 240,
  'ooty-coorg': 310,
  'coorg-ooty': 310,
  'ooty-kochi': 280,
  'kochi-ooty': 280,
  'ooty-kodaikanal': 250,
  'kodaikanal-ooty': 250,
  'ooty-wayanad': 110,
  'wayanad-ooty': 110,
  'ooty-madurai': 300,
  'madurai-ooty': 300,
  'ooty-chennai': 550,
  'chennai-ooty': 550
};

// Calculate distance based on pickup and drop
const getEstimateDistance = (pickup, drop) => {
  const p = pickup.toLowerCase().replace(/[^a-z]/g, '');
  const d = drop.toLowerCase().replace(/[^a-z]/g, '');
  
  // Search matching keys
  for (let key in DISTANCE_MATRIX) {
    const parts = key.split('-');
    if (
      (p.includes(parts[0]) && d.includes(parts[1])) ||
      (p.includes(parts[1]) && d.includes(parts[0]))
    ) {
      return DISTANCE_MATRIX[key];
    }
  }
  return 150; // default/average distance if not found
};

// Live Fare Estimation API
const estimateFare = async (req, res) => {
  const { pickup, drop, vehicleCategory, bookingType } = req.body;
  if (!pickup || !drop || !vehicleCategory) {
    return res.status(400).json({ success: false, message: 'Pickup, drop, and vehicle category are required' });
  }

  try {
    const distance = getEstimateDistance(pickup, drop);
    
    // Find rate per KM for category
    const rates = {
      'Hatchback': 12,
      'Sedan': 14,
      'SUV': 19,
      'Innova Crysta': 22,
      'Tempo Traveller': 26,
      'Luxury Vehicles': 45
    };
    
    const rate = rates[vehicleCategory] || 15;
    let multiplier = 1;
    if (bookingType === 'Round Trip Taxi') multiplier = 1.8; // discount on round trip return
    
    const baseFare = distance * rate * multiplier;
    // Add hill station toll fee if it goes to Ooty / Kodaikanal
    const hasHillStation = pickup.toLowerCase().includes('ooty') || pickup.toLowerCase().includes('kodai') || 
                           drop.toLowerCase().includes('ooty') || drop.toLowerCase().includes('kodai');
    const driverBeta = 300; // flat driver daily allowance
    const tollCharges = hasHillStation ? 400 : 150;
    
    const totalFare = Math.round(baseFare + driverBeta + tollCharges);

    res.status(200).json({
      success: true,
      distance: `${distance} km`,
      ratePerKm: rate,
      baseFare,
      driverBeta,
      tollCharges,
      estimatedFare: totalFare
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a booking
const createBooking = async (req, res) => {
  try {
    const { pickup, drop, bookingType, dateTime, returnDateTime, passengers, vehicleCategory, customerDetails, estimatedFare, paymentStatus, paymentId } = req.body;
    
    const bookingId = 'OTD-' + Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const booking = await dataService.bookings.create({
      bookingId,
      pickup,
      drop,
      bookingType,
      dateTime,
      returnDateTime,
      passengers,
      vehicleCategory,
      customerDetails,
      estimatedFare,
      paymentStatus: paymentStatus || 'Pending',
      paymentId,
      status: 'Pending',
      invoiceNumber
    });

    // Notify Customer and Admin
    const customerPhone = customerDetails.phone;
    const smsMsg = `Hi ${customerDetails.name}, your cab booking ${bookingId} from ${pickup} to ${drop} is received. Est Fare: Rs. ${estimatedFare}. Team Ooty Travels.`;
    await sendSMS(customerPhone, smsMsg);
    await sendWhatsApp(customerPhone, smsMsg);
    await sendEmail(customerDetails.email, 'Booking Confirmed - Ooty Travels Designer', smsMsg);

    res.status(201).json({ success: true, message: 'Booking completed successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await dataService.bookings.find({});
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await dataService.bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status / Assign Driver
const updateBooking = async (req, res) => {
  try {
    const { status, driverAssigned, vehicleAssigned, paymentStatus } = req.body;
    
    // Fetch original booking details
    const booking = await dataService.bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updated = await dataService.bookings.findByIdAndUpdate(req.params.id, {
      status: status || booking.status,
      driverAssigned: driverAssigned || booking.driverAssigned,
      vehicleAssigned: vehicleAssigned || booking.vehicleAssigned,
      paymentStatus: paymentStatus || booking.paymentStatus
    });

    // Notify updates if driver assigned
    if (driverAssigned && driverAssigned !== booking.driverAssigned) {
      const driver = await dataService.users.findById(driverAssigned);
      if (driver) {
        const msg = `Ooty Travels: Driver ${driver.name} (${driver.phone}) has been assigned to your ride ${booking.bookingId}. Vehicle: ${driver.vehicleAssigned || 'TBA'}.`;
        await sendSMS(booking.customerDetails.phone, msg);
        await sendWhatsApp(booking.customerDetails.phone, msg);
      }
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await dataService.bookings.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate Invoice PDF
const getInvoice = async (req, res) => {
  try {
    const booking = await dataService.bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const pdfBuffer = await generateInvoicePDF(booking);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${booking.bookingId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await dataService.bookings.delete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { estimateFare, createBooking, getBookings, getBookingById, updateBooking, cancelBooking, getInvoice, deleteBooking };
