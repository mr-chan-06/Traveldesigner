const PDFDocument = require('pdfkit');

const generateInvoicePDF = (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header block
      doc
        .fillColor('#0F172A')
        .fontSize(24)
        .text('OOTY TRAVELS DESIGNER', 50, 45, { align: 'left' });
      
      doc
        .fontSize(10)
        .fillColor('#475569')
        .text('Head Office: Ooty, Tamil Nadu, India', 50, 75)
        .text('Phone: +91 98765 43210 | Email: booking@ootytravels.com', 50, 90)
        .moveDown();

      // Divider line
      doc
        .strokeColor('#E2E8F0')
        .lineWidth(1)
        .moveTo(50, 115)
        .lineTo(550, 115)
        .stroke();

      // Invoice info details
      doc
        .fillColor('#0F172A')
        .fontSize(16)
        .text(`INVOICE: ${booking.invoiceNumber || 'INV-TEMP'}`, 50, 130);

      doc
        .fontSize(10)
        .fillColor('#475569')
        .text(`Date: ${new Date().toLocaleDateString()}`, 50, 155)
        .text(`Booking Ref: ${booking.bookingId}`, 50, 170)
        .text(`Trip Type: ${booking.bookingType}`, 50, 185)
        .moveDown();

      // Customer section
      doc
        .fillColor('#0F172A')
        .fontSize(12)
        .text('Customer Details', 50, 215)
        .fontSize(10)
        .fillColor('#475569')
        .text(`Name: ${booking.customerDetails.name}`, 50, 230)
        .text(`Email: ${booking.customerDetails.email}`, 50, 245)
        .text(`Phone: ${booking.customerDetails.phone}`, 50, 260)
        .moveDown();

      // Route / Journey section
      doc
        .fillColor('#0F172A')
        .fontSize(12)
        .text('Journey Details', 300, 215)
        .fontSize(10)
        .fillColor('#475569')
        .text(`Pickup: ${booking.pickup}`, 300, 230)
        .text(`Drop: ${booking.drop}`, 300, 245)
        .text(`Date & Time: ${new Date(booking.dateTime).toLocaleString()}`, 300, 260)
        .moveDown();

      // Table Header
      const tableTop = 300;
      doc
        .fillColor('#0F172A')
        .fontSize(11)
        .text('Item Description', 50, tableTop)
        .text('Vehicle Category', 250, tableTop)
        .text('Status', 400, tableTop)
        .text('Amount', 480, tableTop, { align: 'right' });

      // Table line
      doc
        .strokeColor('#CBD5E1')
        .lineWidth(1)
        .moveTo(50, 315)
        .lineTo(550, 315)
        .stroke();

      // Table Row
      const rowTop = 330;
      doc
        .fontSize(10)
        .fillColor('#475569')
        .text(`Cab Rental - Ooty Travels Designer (${booking.bookingType})`, 50, rowTop)
        .text(booking.vehicleCategory || 'Sedan', 250, rowTop)
        .text(booking.paymentStatus === 'Paid' ? 'PAID' : 'PENDING', 400, rowTop)
        .text(`Rs. ${booking.estimatedFare.toFixed(2)}`, 480, rowTop, { align: 'right' });

      // Total block
      doc
        .strokeColor('#E2E8F0')
        .lineWidth(1)
        .moveTo(50, 360)
        .lineTo(550, 360)
        .stroke();

      doc
        .fillColor('#0F172A')
        .fontSize(12)
        .text('Total Amount:', 350, 380)
        .text(`Rs. ${booking.estimatedFare.toFixed(2)}`, 480, 380, { align: 'right' });

      // Footer notice
      doc
        .fontSize(10)
        .fillColor('#94A3B8')
        .text('Thank you for riding with Ooty Travels Designer. Have a safe and happy journey!', 50, 480, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateInvoicePDF };
