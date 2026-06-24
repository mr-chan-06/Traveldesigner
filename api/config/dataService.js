const { getIsConnected } = require('./db');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Destination = require('../models/Destination');
const TourPackage = require('../models/TourPackage');
const Enquiry = require('../models/Enquiry');
const bcrypt = require('bcryptjs');

// In-Memory Data Store (Fallback)
const memoryStore = {
  users: [],
  bookings: [],
  vehicles: [],
  destinations: [],
  packages: [],
  enquiries: []
};

// Helper to hash passwords for memory users
const hashPasswordSync = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// Seed default data for fallback store
const seedDefaultData = () => {
  // 1. Seed Users (Admin, Manager, Drivers)
  memoryStore.users = [
    {
      _id: 'user_admin_1',
      name: 'Ooty Travels Admin',
      email: 'admin@ootytravels.com',
      password: hashPasswordSync('admin123'),
      role: 'Admin',
      phone: '+91 98765 00001',
      status: 'Available',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'user_manager_1',
      name: 'Operations Manager',
      email: 'manager@ootytravels.com',
      password: hashPasswordSync('manager123'),
      role: 'Manager',
      phone: '+91 98765 00002',
      status: 'Available',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'user_driver_1',
      name: 'Ramesh Kumar',
      email: 'ramesh@ootytravels.com',
      password: hashPasswordSync('driver123'),
      role: 'Driver',
      phone: '+91 98765 00101',
      status: 'Available',
      licenseNumber: 'DL-TN43A2022001',
      vehicleAssigned: 'TN-43-Y-1234',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'user_driver_2',
      name: 'Suresh Kumar',
      email: 'suresh@ootytravels.com',
      password: hashPasswordSync('driver123'),
      role: 'Driver',
      phone: '+91 98765 00102',
      status: 'On Trip',
      licenseNumber: 'DL-TN43B2021445',
      vehicleAssigned: 'TN-43-Z-5678',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'user_driver_3',
      name: 'Anand Raj',
      email: 'anand@ootytravels.com',
      password: hashPasswordSync('driver123'),
      role: 'Driver',
      phone: '+91 98765 00103',
      status: 'Available',
      licenseNumber: 'DL-KL07C2023778',
      vehicleAssigned: 'KL-07-BB-9999',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // 2. Seed Vehicles
  memoryStore.vehicles = [
    {
      _id: 'veh_1',
      name: 'Maruti Suzuki Dzire',
      category: 'Sedan',
      seatingCapacity: 4,
      luggageCapacity: 2,
      acType: 'AC',
      pricePerKm: 14,
      plateNumber: 'TN-43-Y-1234',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
      maintenanceRecords: [
        { date: new Date('2026-05-10'), description: 'Oil change and brake pads replacement', cost: 3500 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'veh_2',
      name: 'Toyota Innova Crysta',
      category: 'Innova Crysta',
      seatingCapacity: 7,
      luggageCapacity: 4,
      acType: 'AC',
      pricePerKm: 22,
      plateNumber: 'TN-43-Z-5678',
      status: 'On Trip',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
      maintenanceRecords: [
        { date: new Date('2026-06-01'), description: 'Tyre alignment & rotation', cost: 1800 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'veh_3',
      name: 'Hyundai i20',
      category: 'Hatchback',
      seatingCapacity: 4,
      luggageCapacity: 1,
      acType: 'AC',
      pricePerKm: 12,
      plateNumber: 'KL-07-BB-9999',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600',
      maintenanceRecords: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'veh_4',
      name: 'Mahindra XUV700',
      category: 'SUV',
      seatingCapacity: 7,
      luggageCapacity: 3,
      acType: 'AC',
      pricePerKm: 19,
      plateNumber: 'KA-01-MJ-8888',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
      maintenanceRecords: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'veh_5',
      name: 'Force Traveller 12-Seater',
      category: 'Tempo Traveller',
      seatingCapacity: 12,
      luggageCapacity: 8,
      acType: 'AC',
      pricePerKm: 26,
      plateNumber: 'TN-43-TT-2468',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
      maintenanceRecords: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'veh_6',
      name: 'Mercedes Benz E-Class',
      category: 'Luxury Vehicles',
      seatingCapacity: 4,
      luggageCapacity: 3,
      acType: 'AC',
      pricePerKm: 45,
      plateNumber: 'KA-03-MB-0007',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600',
      maintenanceRecords: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // 3. Seed Destinations
  memoryStore.destinations = [
    {
      _id: 'dest_1',
      name: 'Ooty (Queen of Hill Stations)',
      state: 'Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600',
      description: 'Charming hill town in Tamil Nadu surrounded by the Nilgiri Hills, famous for tea gardens, botanical gardens, and the toy train.',
      distance: '0 km',
      estimatedFare: 0,
      popularSpots: ['Doddabetta Peak', 'Botanical Gardens', 'Ooty Lake', 'Tea Museum', 'Pykara Waterfalls']
    },
    {
      _id: 'dest_2',
      name: 'Munnar',
      state: 'Kerala',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600',
      description: 'Lush tea plantations, winding lanes, mist-covered hills, and gorgeous viewpoints. A true nature lovers paradise.',
      distance: '240 km',
      estimatedFare: 4200,
      popularSpots: ['Eravikulam National Park', 'Mattupetty Dam', 'Anamudi Peak', 'Echo Point']
    },
    {
      _id: 'dest_3',
      name: 'Coorg',
      state: 'Karnataka',
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=600',
      description: 'Known as the Scotland of India, famous for its coffee plantations, rich culture, and beautiful waterfalls.',
      distance: '310 km',
      estimatedFare: 5500,
      popularSpots: ['Abbey Falls', 'Raja Seat', 'Namdroling Monastery (Golden Temple)', 'Tadiandamol Peak']
    },
    {
      _id: 'dest_4',
      name: 'Kodaikanal',
      state: 'Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1612456225451-bb8d10d0131d?auto=format&fit=crop&q=80&w=600',
      description: 'The Gift of the Forest, popular for Kodaikanal Lake, pine forests, pillar rocks, and misty valleys.',
      distance: '250 km',
      estimatedFare: 4300,
      popularSpots: ['Kodi Lake', 'Coakers Walk', 'Pillar Rocks', 'Bryant Park']
    },
    {
      _id: 'dest_5',
      name: 'Mysore',
      state: 'Karnataka',
      image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=600',
      description: 'The City of Palaces, famous for its royal heritage, Mysore Palace, Chamundi Hills, and rich sandalwood carvings.',
      distance: '125 km',
      estimatedFare: 2200,
      popularSpots: ['Mysore Palace', 'Brindavan Gardens', 'Chamundeshwari Temple', 'Mysore Zoo']
    }
  ];

  // 4. Seed Tour Packages
  memoryStore.packages = [
    {
      _id: 'pkg_1',
      name: 'Ooty Hills Getaway',
      category: 'Ooty Package',
      duration: '3 Days / 2 Nights',
      placesCovered: ['Ooty Lake', 'Botanical Garden', 'Doddabetta', 'Coonoor Sim Park', 'Dolphin Nose'],
      vehicleCategory: 'Sedan',
      accommodation: true,
      price: 8999,
      description: 'Experience the best of the Nilgiris. This package covers primary sightseeing in Ooty and Coonoor, with premium cab transport and cozy hotel stays.',
      highlights: ['Tea Factory Tour', 'Toy Train Ride Experience', 'Private Cab throughout'],
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600'
    },
    {
      _id: 'pkg_2',
      name: 'Misty Munnar & Kerala Delights',
      category: 'Kerala Package',
      duration: '4 Days / 3 Nights',
      placesCovered: ['Munnar Tea Estates', 'Mattupetty Dam', 'Eravikulam Park', 'Kochi Fort', 'Alleppey Backwaters'],
      vehicleCategory: 'SUV',
      accommodation: true,
      price: 15499,
      description: 'A magical tour combining the misty hills of Munnar with the pristine beauty of Kerala backwaters.',
      highlights: ['Spice Plantation Walk', 'Houseboat Day Cruise', 'Premium SUV Travel'],
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600'
    },
    {
      _id: 'pkg_3',
      name: 'Royal Karnataka Heritage',
      category: 'Karnataka Package',
      duration: '5 Days / 4 Nights',
      placesCovered: ['Bangalore Palace', 'Mysore Palace', 'Brindavan Gardens', 'Coorg Abbey Falls', 'Dubare Elephant Camp'],
      vehicleCategory: 'Innova Crysta',
      accommodation: true,
      price: 21999,
      description: 'Explore the royal legacy of Mysore and the natural coffee trails of Coorg in ultimate comfort.',
      highlights: ['Mysore Palace Evening Lighting', 'Coffee Estate Walk', 'Innova Crysta Premium Travel'],
      image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=600'
    }
  ];

  // 5. Seed Bookings
  memoryStore.bookings = [
    {
      _id: 'book_1',
      bookingId: 'OTD-100254',
      pickup: 'Ooty Head Office',
      drop: 'Coimbatore Airport (CJB)',
      bookingType: 'Airport Transfers',
      dateTime: new Date(Date.now() + 86400000 * 2), // 2 days later
      passengers: 3,
      vehicleCategory: 'Sedan',
      vehicleAssigned: 'veh_1',
      driverAssigned: 'user_driver_1',
      customerDetails: {
        name: 'Arun Prasath',
        email: 'arun@gmail.com',
        phone: '+91 94432 12345',
        secondaryPhone: '+91 94432 54321'
      },
      estimatedFare: 2800,
      paymentStatus: 'Paid',
      paymentId: 'pay_ABC123XYZ',
      status: 'Assigned',
      invoiceNumber: 'INV-2026-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'book_2',
      bookingId: 'OTD-100255',
      pickup: 'Munnar Hotel',
      drop: 'Ooty Town Center',
      bookingType: 'Outstation Trips',
      dateTime: new Date(Date.now() - 86400000 * 3), // 3 days ago (completed)
      passengers: 6,
      vehicleCategory: 'Innova Crysta',
      vehicleAssigned: 'veh_2',
      driverAssigned: 'user_driver_2',
      customerDetails: {
        name: 'Deepa Nair',
        email: 'deepa@yahoo.com',
        phone: '+91 98950 98765'
      },
      estimatedFare: 6500,
      paymentStatus: 'Paid',
      paymentId: 'pay_DEF456UVW',
      status: 'Completed',
      invoiceNumber: 'INV-2026-002',
      createdAt: new Date(Date.now() - 86400000 * 4),
      updatedAt: new Date(Date.now() - 86400000 * 3)
    },
    {
      _id: 'book_3',
      bookingId: 'OTD-100256',
      pickup: 'Bangalore Majestic',
      drop: 'Ooty Botanical Garden',
      bookingType: 'Round Trip Taxi',
      dateTime: new Date(Date.now() + 86400000 * 5), // 5 days later
      passengers: 4,
      vehicleCategory: 'SUV',
      customerDetails: {
        name: 'Karthik Rao',
        email: 'karthik@outlook.com',
        phone: '+91 80950 11223'
      },
      estimatedFare: 11200,
      paymentStatus: 'Pending',
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // 6. Seed Enquiries
  memoryStore.enquiries = [
    {
      _id: 'enq_1',
      name: 'Meena Subramaniam',
      email: 'meena@gmail.com',
      phone: '+91 94440 55555',
      subject: 'Outstation Trip Coimbatore to Ooty',
      message: 'Need a price estimation for 12 people in a Tempo Traveller for next weekend.',
      source: 'Contact Form Lead',
      status: 'Pending',
      createdAt: new Date()
    },
    {
      _id: 'enq_2',
      name: 'John Wesley',
      phone: '+91 99940 77777',
      source: 'Callback Request',
      status: 'Contacted',
      notes: 'Called and discussed custom Ooty honeymoon tour package.',
      createdAt: new Date(Date.now() - 86400000)
    }
  ];
};

seedDefaultData();

// Repository pattern wrapper methods
const dataService = {
  // --- USERS ---
  users: {
    find: async (query = {}) => {
      if (getIsConnected()) return await User.find(query);
      return memoryStore.users.filter(u => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findOne: async (query = {}) => {
      if (getIsConnected()) return await User.findOne(query);
      return memoryStore.users.find(u => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    },
    findById: async (id) => {
      if (getIsConnected()) return await User.findById(id);
      return memoryStore.users.find(u => u._id === id) || null;
    },
    create: async (data) => {
      if (getIsConnected()) {
        const newUser = new User(data);
        return await newUser.save();
      }
      const newUser = {
        _id: 'user_' + Math.random().toString(36).substr(2, 9),
        ...data,
        password: hashPasswordSync(data.password),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.users.push(newUser);
      return newUser;
    },
    findByIdAndUpdate: async (id, data, options = {}) => {
      if (getIsConnected()) return await User.findByIdAndUpdate(id, data, { new: true, ...options });
      const index = memoryStore.users.findIndex(u => u._id === id);
      if (index === -1) return null;
      memoryStore.users[index] = { ...memoryStore.users[index], ...data, updatedAt: new Date() };
      return memoryStore.users[index];
    },
    delete: async (id) => {
      if (getIsConnected()) return await User.findByIdAndDelete(id);
      const index = memoryStore.users.findIndex(u => u._id === id);
      if (index === -1) return null;
      const deleted = memoryStore.users[index];
      memoryStore.users.splice(index, 1);
      return deleted;
    }
  },

  // --- BOOKINGS ---
  bookings: {
    find: async (query = {}) => {
      if (getIsConnected()) return await Booking.find(query).populate('vehicleAssigned').populate('driverAssigned');
      // Simulated populate for memory store
      return memoryStore.bookings.map(b => {
        const vehicle = memoryStore.vehicles.find(v => v._id === b.vehicleAssigned) || null;
        const driver = memoryStore.users.find(u => u._id === b.driverAssigned) || null;
        return {
          ...b,
          vehicleAssigned: vehicle,
          driverAssigned: driver
        };
      });
    },
    findById: async (id) => {
      if (getIsConnected()) return await Booking.findById(id).populate('vehicleAssigned').populate('driverAssigned');
      const b = memoryStore.bookings.find(x => x._id === id || x.bookingId === id);
      if (!b) return null;
      const vehicle = memoryStore.vehicles.find(v => v._id === b.vehicleAssigned) || null;
      const driver = memoryStore.users.find(u => u._id === b.driverAssigned) || null;
      return {
        ...b,
        vehicleAssigned: vehicle,
        driverAssigned: driver
      };
    },
    create: async (data) => {
      if (getIsConnected()) {
        const newBooking = new Booking(data);
        return await newBooking.save();
      }
      const newBooking = {
        _id: 'book_' + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.bookings.push(newBooking);
      return newBooking;
    },
    findByIdAndUpdate: async (id, data) => {
      if (getIsConnected()) return await Booking.findByIdAndUpdate(id, data, { new: true });
      const index = memoryStore.bookings.findIndex(b => b._id === id || b.bookingId === id);
      if (index === -1) return null;
      memoryStore.bookings[index] = { ...memoryStore.bookings[index], ...data, updatedAt: new Date() };
      return memoryStore.bookings[index];
    },
    delete: async (id) => {
      if (getIsConnected()) return await Booking.findByIdAndDelete(id);
      const index = memoryStore.bookings.findIndex(b => b._id === id);
      if (index === -1) return null;
      const deleted = memoryStore.bookings[index];
      memoryStore.bookings.splice(index, 1);
      return deleted;
    }
  },

  // --- VEHICLES ---
  vehicles: {
    find: async (query = {}) => {
      if (getIsConnected()) return await Vehicle.find(query);
      return memoryStore.vehicles.filter(v => {
        for (let key in query) {
          if (v[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findById: async (id) => {
      if (getIsConnected()) return await Vehicle.findById(id);
      return memoryStore.vehicles.find(v => v._id === id) || null;
    },
    create: async (data) => {
      if (getIsConnected()) {
        const newVehicle = new Vehicle(data);
        return await newVehicle.save();
      }
      const newVehicle = {
        _id: 'veh_' + Math.random().toString(36).substr(2, 9),
        maintenanceRecords: [],
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.vehicles.push(newVehicle);
      return newVehicle;
    },
    findByIdAndUpdate: async (id, data) => {
      if (getIsConnected()) return await Vehicle.findByIdAndUpdate(id, data, { new: true });
      const index = memoryStore.vehicles.findIndex(v => v._id === id);
      if (index === -1) return null;
      memoryStore.vehicles[index] = { ...memoryStore.vehicles[index], ...data, updatedAt: new Date() };
      return memoryStore.vehicles[index];
    },
    delete: async (id) => {
      if (getIsConnected()) return await Vehicle.findByIdAndDelete(id);
      const index = memoryStore.vehicles.findIndex(v => v._id === id);
      if (index === -1) return null;
      const deleted = memoryStore.vehicles[index];
      memoryStore.vehicles.splice(index, 1);
      return deleted;
    }
  },

  // --- DESTINATIONS ---
  destinations: {
    find: async (query = {}) => {
      if (getIsConnected()) return await Destination.find(query);
      return memoryStore.destinations.filter(d => {
        for (let key in query) {
          if (d[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findById: async (id) => {
      if (getIsConnected()) return await Destination.findById(id);
      return memoryStore.destinations.find(d => d._id === id) || null;
    },
    create: async (data) => {
      if (getIsConnected()) {
        const newDest = new Destination(data);
        return await newDest.save();
      }
      const newDest = {
        _id: 'dest_' + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.destinations.push(newDest);
      return newDest;
    },
    findByIdAndUpdate: async (id, data) => {
      if (getIsConnected()) return await Destination.findByIdAndUpdate(id, data, { new: true });
      const index = memoryStore.destinations.findIndex(d => d._id === id);
      if (index === -1) return null;
      memoryStore.destinations[index] = { ...memoryStore.destinations[index], ...data, updatedAt: new Date() };
      return memoryStore.destinations[index];
    },
    delete: async (id) => {
      if (getIsConnected()) return await Destination.findByIdAndDelete(id);
      const index = memoryStore.destinations.findIndex(d => d._id === id);
      if (index === -1) return null;
      const deleted = memoryStore.destinations[index];
      memoryStore.destinations.splice(index, 1);
      return deleted;
    }
  },

  // --- TOUR PACKAGES ---
  packages: {
    find: async (query = {}) => {
      if (getIsConnected()) return await TourPackage.find(query);
      return memoryStore.packages.filter(p => {
        for (let key in query) {
          if (p[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findById: async (id) => {
      if (getIsConnected()) return await TourPackage.findById(id);
      return memoryStore.packages.find(p => p._id === id) || null;
    },
    create: async (data) => {
      if (getIsConnected()) {
        const newPkg = new TourPackage(data);
        return await newPkg.save();
      }
      const newPkg = {
        _id: 'pkg_' + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.packages.push(newPkg);
      return newPkg;
    },
    findByIdAndUpdate: async (id, data) => {
      if (getIsConnected()) return await TourPackage.findByIdAndUpdate(id, data, { new: true });
      const index = memoryStore.packages.findIndex(p => p._id === id);
      if (index === -1) return null;
      memoryStore.packages[index] = { ...memoryStore.packages[index], ...data, updatedAt: new Date() };
      return memoryStore.packages[index];
    },
    delete: async (id) => {
      if (getIsConnected()) return await TourPackage.findByIdAndDelete(id);
      const index = memoryStore.packages.findIndex(p => p._id === id);
      if (index === -1) return null;
      const deleted = memoryStore.packages[index];
      memoryStore.packages.splice(index, 1);
      return deleted;
    }
  },

  // --- ENQUIRIES ---
  enquiries: {
    find: async (query = {}) => {
      if (getIsConnected()) return await Enquiry.find(query);
      return memoryStore.enquiries.filter(e => {
        for (let key in query) {
          if (e[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findById: async (id) => {
      if (getIsConnected()) return await Enquiry.findById(id);
      return memoryStore.enquiries.find(e => e._id === id) || null;
    },
    create: async (data) => {
      if (getIsConnected()) {
        const newEnq = new Enquiry(data);
        return await newEnq.save();
      }
      const newEnq = {
        _id: 'enq_' + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.enquiries.push(newEnq);
      return newEnq;
    },
    findByIdAndUpdate: async (id, data) => {
      if (getIsConnected()) return await Enquiry.findByIdAndUpdate(id, data, { new: true });
      const index = memoryStore.enquiries.findIndex(e => e._id === id);
      if (index === -1) return null;
      memoryStore.enquiries[index] = { ...memoryStore.enquiries[index], ...data, updatedAt: new Date() };
      return memoryStore.enquiries[index];
    },
    delete: async (id) => {
      if (getIsConnected()) return await Enquiry.findByIdAndDelete(id);
      const index = memoryStore.enquiries.findIndex(e => e._id === id);
      if (index === -1) return null;
      const deleted = memoryStore.enquiries[index];
      memoryStore.enquiries.splice(index, 1);
      return deleted;
    }
  }
};

const seedMongoDB = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default users into MongoDB...');
      for (const u of memoryStore.users) {
        const plainPassword = u.email === 'admin@ootytravels.com' ? 'admin123' : 
                            u.email === 'manager@ootytravels.com' ? 'manager123' : 'driver123';
        await User.create({
          name: u.name,
          email: u.email,
          password: plainPassword,
          role: u.role,
          phone: u.phone,
          status: u.status || 'Available',
          licenseNumber: u.licenseNumber,
          vehicleAssigned: u.vehicleAssigned
        });
      }
    }

    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      console.log('Seeding default vehicles into MongoDB...');
      await Vehicle.insertMany(memoryStore.vehicles.map(({ _id, ...v }) => v));
    }

    const destCount = await Destination.countDocuments();
    if (destCount === 0) {
      console.log('Seeding default destinations into MongoDB...');
      await Destination.insertMany(memoryStore.destinations.map(({ _id, ...d }) => d));
    }

    const pkgCount = await TourPackage.countDocuments();
    if (pkgCount === 0) {
      console.log('Seeding default tour packages into MongoDB...');
      await TourPackage.insertMany(memoryStore.packages.map(({ _id, ...p }) => p));
    }

    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      console.log('Seeding default bookings into MongoDB...');
      for (const b of memoryStore.bookings) {
        const dbDriver = await User.findOne({ email: b.driverAssigned === 'user_driver_1' ? 'ramesh@ootytravels.com' : 'suresh@ootytravels.com' });
        const dbVehicle = await Vehicle.findOne({ plateNumber: b.vehicleAssigned === 'veh_1' ? 'TN-43-Y-1234' : 'TN-43-Z-5678' });
        await Booking.create({
          bookingId: b.bookingId,
          pickup: b.pickup,
          drop: b.drop,
          bookingType: b.bookingType,
          dateTime: b.dateTime,
          passengers: b.passengers,
          vehicleCategory: b.vehicleCategory,
          vehicleAssigned: dbVehicle ? dbVehicle._id : undefined,
          driverAssigned: dbDriver ? dbDriver._id : undefined,
          customerDetails: b.customerDetails,
          estimatedFare: b.estimatedFare,
          paymentStatus: b.paymentStatus,
          paymentId: b.paymentId,
          status: b.status,
          invoiceNumber: b.invoiceNumber
        });
      }
    }

    const enquiryCount = await Enquiry.countDocuments();
    if (enquiryCount === 0) {
      console.log('Seeding default enquiries into MongoDB...');
      await Enquiry.insertMany(memoryStore.enquiries.map(({ _id, ...e }) => e));
    }

    console.log('MongoDB Seed check completed successfully!');
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
  }
};

dataService.seedMongoDB = seedMongoDB;

module.exports = dataService;
