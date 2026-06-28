import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, Car, MapPin, Compass, PhoneCall, 
  Settings, CheckCircle, Clock, Ban, DollarSign, Plus, FileText, UserPlus, Trash2, Pencil
} from 'lucide-react';
import axios from 'axios';

// Chart JS imports and registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form popups visibility states
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showDestModal, setShowDestModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [assignModal, setAssignModal] = useState({ open: false, bookingId: null });

  // Fields for Add Driver
  const [newDriver, setNewDriver] = useState({ name: '', email: '', password: 'driver123', phone: '', licenseNumber: '', vehicleAssigned: '' });
  // Fields for Add Vehicle
  const [newVehicle, setNewVehicle] = useState({ name: '', category: 'Sedan', seatingCapacity: 4, luggageCapacity: 2, pricePerKm: 14, plateNumber: '', acType: 'AC', image: '' });
  // Fields for Add Booking
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickup: '',
    drop: '',
    bookingType: 'Local City Rides',
    dateTime: '',
    passengers: 1,
    vehicleCategory: 'Sedan',
    estimatedFare: 1500
  });
  // Fields for Add Lead
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    source: 'Walk-in',
    message: ''
  });
  // Fields for Add Destination
  const [newDest, setNewDest] = useState({
    name: '',
    state: 'Tamil Nadu',
    image: '',
    description: '',
    distance: '',
    estimatedFare: '',
    popularSpots: ''
  });
  // Fields for Add Package
  const [newPackage, setNewPackage] = useState({
    name: '',
    category: 'Ooty Package',
    duration: '3 Days / 2 Nights',
    placesCovered: '',
    vehicleCategory: 'Sedan',
    accommodation: true,
    price: '',
    description: '',
    highlights: '',
    image: ''
  });
  // Driver assignment selection
  const [selectedDriver, setSelectedDriver] = useState('');

  const createDestinationFormState = (dest = null) => ({
    name: dest?.name || '',
    state: dest?.state || 'Tamil Nadu',
    image: dest?.image || '',
    description: dest?.description || '',
    distance: dest?.distance || '',
    estimatedFare: dest?.estimatedFare || '',
    popularSpots: dest?.popularSpots ? dest.popularSpots.join(', ') : ''
  });

  const createPackageFormState = (pkg = null) => ({
    name: pkg?.name || '',
    category: pkg?.category || 'Ooty Package',
    duration: pkg?.duration || '3 Days / 2 Nights',
    placesCovered: pkg?.placesCovered ? pkg.placesCovered.join(', ') : '',
    vehicleCategory: pkg?.vehicleCategory || 'Sedan',
    accommodation: pkg?.accommodation ?? true,
    price: pkg?.price || '',
    description: pkg?.description || '',
    highlights: pkg?.highlights ? pkg.highlights.join(', ') : '',
    image: pkg?.image || ''
  });

  const resetDestinationForm = () => {
    setNewDest(createDestinationFormState());
    setEditingDestination(null);
    setShowDestModal(false);
  };

  const openDestinationModal = (dest = null) => {
    setEditingDestination(dest);
    setNewDest(createDestinationFormState(dest));
    setShowDestModal(true);
  };

  const resetPackageForm = () => {
    setNewPackage(createPackageFormState());
    setEditingPackage(null);
    setShowPackageModal(false);
  };

  const openPackageModal = (pkg = null) => {
    setEditingPackage(pkg);
    setNewPackage(createPackageFormState(pkg));
    setShowPackageModal(true);
  };

  // Protect Admin Access
  useEffect(() => {
    if (!isAuthenticated || (user.role !== 'Admin' && user.role !== 'Manager')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const fallbackPkgs = [
    { _id: 'p1', name: 'Ooty Hills Escape Tour', category: 'Ooty Package', duration: '3 Days / 2 Nights', placesCovered: ['Ooty Lake', 'Botanical Gardens', 'Doddabetta Peak', 'Coonoor SIMS Park', 'Pykara Waterfalls'], vehicleCategory: 'Sedan', accommodation: true, price: 8999, highlights: ['Toy Train ride booking support', 'Local tea garden walks', 'Private cab for sightseeing'], image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600' },
    { _id: 'p2', name: 'Misty Munnar Tea Trail', category: 'Kerala Package', duration: '4 Days / 3 Nights', placesCovered: ['Munnar tea gardens', 'Eravikulam National Park', 'Mattupetty Dam', 'Alleppey Backwaters'], vehicleCategory: 'SUV', accommodation: true, price: 15499, highlights: ['Spice plantation visits', 'Alleppey day boat cruise', 'Dedicated driver for entire tour'], image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600' },
    { _id: 'p3', name: 'Royal Mysore & Coorg Coffee Trail', category: 'Karnataka Package', duration: '5 Days / 4 Nights', placesCovered: ['Mysore Palace', 'Chamundi Hills', 'Coorg Abbey Falls', 'Raja Seat', 'Bylakuppe Golden Temple'], vehicleCategory: 'Innova Crysta', accommodation: true, price: 21999, highlights: ['Mysore Palace lighting tour', 'Elephant camp interactions', 'Premium Innova Crysta booking'], image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=600' },
    { _id: 'p4', name: 'Grand South India Heritage Tour', category: 'South India Package', duration: '8 Days / 7 Nights', placesCovered: ['Ooty Hills', 'Kodaikanal Lake', 'Madurai Temple', 'Rameswaram Bridge', 'Kanyakumari Sunset Point'], vehicleCategory: 'Tempo Traveller', accommodation: true, price: 34999, highlights: ['Multi-state travel permission included', 'Covering major cultural monuments', 'Group Tempo Traveller transportation'], image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600' }
  ];

  // Fetch admin dashboard lists
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [bookRes, driverRes, vehicleRes, enqRes, destRes, pkgRes, dbRes] = await Promise.all([
        axios.get('/api/bookings', config).catch(() => ({ data: { data: [] } })),
        axios.get('/api/auth/drivers', config).catch(() => ({ data: { data: [] } })),
        axios.get('/api/vehicles').catch(() => ({ data: { data: [] } })),
        axios.get('/api/enquiries', config).catch(() => ({ data: { data: [] } })),
        axios.get('/api/destinations').catch(() => ({ data: { data: [] } })),
        axios.get('/api/packages').catch(() => ({ data: { data: [] } })),
        axios.get('/api/db-status').catch(() => ({ data: { isConnected: false } }))
      ]);

      setBookings(bookRes.data.data || []);
      setDrivers(driverRes.data.data || []);
      setVehicles(vehicleRes.data.data || []);
      setEnquiries(enqRes.data.data || []);
      setDestinations(destRes.data.data || []);
      setPackages(pkgRes.data.data && pkgRes.data.data.length > 0 ? pkgRes.data.data : fallbackPkgs);
      setDbConnected(dbRes.data.isConnected || false);

    } catch (error) {
      console.error('Error fetching admin data, loading client placeholders', error);
      setPackages(fallbackPkgs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && (user.role === 'Admin' || user.role === 'Manager')) {
      fetchAllData();
    }
  }, [isAuthenticated, user]);

  // Operations
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDriver) return;

    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Find selected driver object to get vehicle
      const drv = drivers.find(d => d._id === selectedDriver);
      const veh = vehicles.find(v => v.plateNumber === drv.vehicleAssigned);

      await axios.put(`/api/bookings/${assignModal.bookingId}`, {
        status: 'Assigned',
        driverAssigned: selectedDriver,
        vehicleAssigned: veh ? veh._id : undefined
      }, config);

      setAssignModal({ open: false, bookingId: null });
      setSelectedDriver('');
      fetchAllData();
    } catch (error) {
      console.error('Error assigning driver', error);
      // Fallback update state locally
      setBookings(bookings.map(b => b.bookingId === assignModal.bookingId || b._id === assignModal.bookingId 
        ? { ...b, status: 'Assigned', driverAssigned: drivers.find(d => d._id === selectedDriver) } 
        : b
      ));
      setAssignModal({ open: false, bookingId: null });
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`/api/bookings/${bookingId}`, { status: newStatus }, config);
      fetchAllData();
    } catch (error) {
      console.error('Error updating status', error);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/bookings/${id}`, config);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting booking', error);
      setBookings(bookings.filter(b => b._id !== id));
    }
  };

  const handleDeleteDriver = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/auth/users/${id}`, config);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting driver', error);
      setDrivers(drivers.filter(d => d._id !== id));
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/vehicles/${id}`, config);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting vehicle', error);
      setVehicles(vehicles.filter(v => v._id !== id));
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/enquiries/${id}`, config);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting lead', error);
      setEnquiries(enquiries.filter(e => e._id !== id));
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        ...newDriver,
        role: 'Driver',
        status: 'Available'
      };

      const response = await axios.post('/api/auth/register', payload, config);
      const driver = response.data?.data;
      if (driver) {
        setDrivers([...drivers, driver]);
      }

      setShowDriverModal(false);
      setNewDriver({ name: '', email: '', password: 'driver123', phone: '', licenseNumber: '', vehicleAssigned: '' });
      fetchAllData();
    } catch (error) {
      console.error('Error registering driver', error);
      setDrivers([...drivers, { _id: 'mock_d_' + Date.now(), ...newDriver, role: 'Driver', status: 'Available' }]);
      setShowDriverModal(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        ...newVehicle,
        seatingCapacity: Number(newVehicle.seatingCapacity),
        luggageCapacity: Number(newVehicle.luggageCapacity),
        pricePerKm: Number(newVehicle.pricePerKm),
        status: 'Available',
        maintenanceRecords: []
      };

      const response = await axios.post('/api/vehicles', payload, config);
      const created = response.data?.data;
      if (created) {
        setVehicles([...vehicles, created]);
      }
      setShowVehicleModal(false);
      setNewVehicle({ name: '', category: 'Sedan', seatingCapacity: 4, luggageCapacity: 2, pricePerKm: 14, plateNumber: '', acType: 'AC', image: '' });
      fetchAllData();
    } catch (error) {
      console.error('Error adding vehicle', error);
      setVehicles([...vehicles, { _id: 'mock_v_' + Date.now(), ...newVehicle, status: 'Available' }]);
      setShowVehicleModal(false);
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        pickup: newBooking.pickup,
        drop: newBooking.drop,
        bookingType: newBooking.bookingType,
        dateTime: newBooking.dateTime,
        passengers: Number(newBooking.passengers),
        vehicleCategory: newBooking.vehicleCategory,
        customerDetails: {
          name: newBooking.customerName,
          phone: newBooking.customerPhone,
          email: newBooking.customerEmail
        },
        estimatedFare: Number(newBooking.estimatedFare)
      };

      await axios.post('/api/bookings', payload, config);
      setShowBookingModal(false);
      setNewBooking({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        pickup: '',
        drop: '',
        bookingType: 'Local City Rides',
        dateTime: '',
        passengers: 1,
        vehicleCategory: 'Sedan',
        estimatedFare: 1500
      });
      fetchAllData();
    } catch (error) {
      console.error('Error adding booking', error);
      setBookings([...bookings, {
        _id: 'mock_b_' + Date.now(),
        bookingId: 'OTD-' + Math.floor(100000 + Math.random() * 900000),
        pickup: newBooking.pickup,
        drop: newBooking.drop,
        bookingType: newBooking.bookingType,
        dateTime: newBooking.dateTime,
        passengers: Number(newBooking.passengers),
        vehicleCategory: newBooking.vehicleCategory,
        customerDetails: {
          name: newBooking.customerName,
          phone: newBooking.customerPhone,
          email: newBooking.customerEmail
        },
        estimatedFare: Number(newBooking.estimatedFare),
        status: 'Pending'
      }]);
      setShowBookingModal(false);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post('/api/enquiries', newLead, config);
      setShowLeadModal(false);
      setNewLead({
        name: '',
        phone: '',
        source: 'Walk-in',
        message: ''
      });
      fetchAllData();
    } catch (error) {
      console.error('Error adding lead', error);
      setEnquiries([...enquiries, {
        _id: 'mock_e_' + Date.now(),
        name: newLead.name,
        phone: newLead.phone,
        source: newLead.source,
        message: newLead.message,
        status: 'Pending'
      }]);
      setShowLeadModal(false);
    }
  };

  const handleSaveDest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        name: newDest.name,
        state: newDest.state,
        image: newDest.image || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600',
        description: newDest.description,
        distance: newDest.distance || '150 km',
        estimatedFare: Number(newDest.estimatedFare || 0),
        popularSpots: newDest.popularSpots ? newDest.popularSpots.split(',').map(s => s.trim()) : []
      };

      if (editingDestination) {
        const { data } = await axios.put(`/api/destinations/${editingDestination._id}`, payload, config);
        const updatedDestination = data?.data || { ...editingDestination, ...payload };
        setDestinations(destinations.map(dest => dest._id === editingDestination._id ? updatedDestination : dest));
      } else {
        const { data } = await axios.post('/api/destinations', payload, config);
        const createdDestination = data?.data || { _id: 'mock_ds_' + Date.now(), ...payload };
        setDestinations([...destinations, createdDestination]);
      }

      resetDestinationForm();
      fetchAllData();
    } catch (error) {
      console.error('Error saving destination', error);
      if (editingDestination) {
        setDestinations(destinations.map(dest => dest._id === editingDestination._id ? { ...dest, ...newDest, estimatedFare: Number(newDest.estimatedFare || 0), popularSpots: newDest.popularSpots ? newDest.popularSpots.split(',').map(s => s.trim()) : [] } : dest));
      } else {
        setDestinations([...destinations, {
          _id: 'mock_ds_' + Date.now(),
          name: newDest.name,
          state: newDest.state,
          image: newDest.image || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600',
          description: newDest.description,
          distance: newDest.distance || '150 km',
          estimatedFare: Number(newDest.estimatedFare || 0),
          popularSpots: newDest.popularSpots ? newDest.popularSpots.split(',').map(s => s.trim()) : []
        }]);
      }
      resetDestinationForm();
    }
  };

  const handleDeleteDest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/destinations/${id}`, config);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting destination', error);
      setDestinations(destinations.filter(d => d._id !== id));
    }
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    const payload = {
      name: newPackage.name,
      category: newPackage.category,
      duration: newPackage.duration,
      placesCovered: newPackage.placesCovered ? newPackage.placesCovered.split(',').map(s => s.trim()) : [],
      vehicleCategory: newPackage.vehicleCategory,
      accommodation: newPackage.accommodation,
      price: Number(newPackage.price || 0),
      description: newPackage.description,
      highlights: newPackage.highlights ? newPackage.highlights.split(',').map(s => s.trim()) : [],
      image: newPackage.image || 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600'
    };

    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingPackage) {
        const { data } = await axios.put(`/api/packages/${editingPackage._id}`, payload, config);
        const updatedPackage = data?.data || { ...editingPackage, ...payload };
        setPackages(packages.map(pkg => pkg._id === editingPackage._id ? updatedPackage : pkg));
      } else {
        const { data } = await axios.post('/api/packages', payload, config);
        const createdPackage = data?.data || { _id: 'mock_pkg_' + Date.now(), ...payload };
        setPackages([...packages, createdPackage]);
      }

      resetPackageForm();
      fetchAllData();
    } catch (error) {
      console.error('Error saving package', error);
      if (editingPackage) {
        setPackages(packages.map(pkg => pkg._id === editingPackage._id ? { ...pkg, ...payload, price: Number(newPackage.price || 0) } : pkg));
      } else {
        setPackages([...packages, {
          _id: 'mock_pkg_' + Date.now(),
          name: newPackage.name,
          category: newPackage.category,
          duration: newPackage.duration,
          placesCovered: newPackage.placesCovered ? newPackage.placesCovered.split(',').map(s => s.trim()) : [],
          vehicleCategory: newPackage.vehicleCategory,
          accommodation: newPackage.accommodation,
          price: Number(newPackage.price || 0),
          description: newPackage.description,
          highlights: newPackage.highlights ? newPackage.highlights.split(',').map(s => s.trim()) : [],
          image: newPackage.image || 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600'
        }]);
      }
      resetPackageForm();
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      const token = localStorage.getItem('ooty_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/packages/${id}`, config);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting package', error);
      setPackages(packages.filter(p => p._id !== id));
    }
  };

  const handleInvoiceDownload = (bookingId) => {
    window.open(`/api/bookings/${bookingId}/invoice`, '_blank');
  };

  // --- STATS COMPUTATIONS ---
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    revenue: bookings.reduce((sum, b) => b.status === 'Completed' || b.paymentStatus === 'Paid' ? sum + b.estimatedFare : sum, 0),
    enquiries: enquiries.length
  };

  // Revenue chart setup
  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Revenue (Rs.)',
      data: [35000, 48000, 52000, 68000, stats.revenue > 0 ? stats.revenue : 78000, stats.revenue + 15000],
      backgroundColor: '#10B981',
      borderRadius: 8
    }]
  };

  // Trip types divisions
  const tripTypesData = {
    labels: ['Local City', 'Airport Drop', 'Outstation', 'Tour Packages'],
    datasets: [{
      data: [
        bookings.filter(b => b.bookingType === 'Local City Rides').length || 2,
        bookings.filter(b => b.bookingType === 'Airport Transfers').length || 3,
        bookings.filter(b => b.bookingType === 'Outstation Trips' || b.bookingType === 'One-Way Taxi' || b.bookingType === 'Round Trip Taxi').length || 5,
        bookings.filter(b => b.bookingType === 'Tour Package').length || 1
      ],
      backgroundColor: ['#0F172A', '#10B981', '#3B82F6', '#F59E0B'],
      borderWidth: 1
    }]
  };

  if (!user) return null;

  return (
    <div className="bg-lightGray dark:bg-darkBlue min-h-screen transition-colors duration-300 pb-20">
      
      {/* Top Banner Control Room */}
      <div className="bg-slate-900 text-white p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-center border-b border-slate-800 gap-4">
        <div>
          <span className="text-emeraldGreen text-xs font-bold uppercase tracking-widest">Ooty HQ Operations Control</span>
          <h1 className="font-display font-extrabold text-3xl mt-1">Hello, {user.name}</h1>
          <p className="text-slate-400 text-xs mt-1 flex flex-wrap items-center gap-2">
            <span>Role Permission: {user.role}</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${dbConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span>
                Database Connection: {dbConnected ? (
                  <span className="text-emerald-400 font-semibold">Connected (MongoDB)</span>
                ) : (
                  <span className="text-amber-400 font-semibold">Fallback Memory Mode (Resilient)</span>
                )}
              </span>
            </span>
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowDriverModal(true)}
            className="px-4 py-2 bg-emeraldGreen text-white font-bold rounded-lg hover:bg-emerald-600 text-xs flex items-center space-x-1.5 shadow"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Driver</span>
          </button>
          <button 
            onClick={() => setShowVehicleModal(true)}
            className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 text-xs flex items-center space-x-1.5 border border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cab</span>
          </button>
        </div>
      </div>

      {/* Tabs list bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto space-x-6">
          {['Overview', 'Bookings', 'Drivers', 'Vehicles', 'Destinations', 'Packages', 'Leads'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-emeraldGreen text-emeraldGreen'
                  : 'text-slate-550 dark:text-slate-400 hover:text-emeraldGreen'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emeraldGreen"></div>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            
            {/* VIEW 1: OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Total Bookings</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-650 dark:text-slate-300">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Pending Approvals</p>
                      <p className="text-2xl font-extrabold text-amber-500 mt-1">{stats.pending}</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-550">
                      <Clock className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Completed Trips</p>
                      <p className="text-2xl font-extrabold text-emeraldGreen mt-1">{stats.completed}</p>
                    </div>
                    <div className="p-3 bg-emeraldGreen/10 rounded-xl text-emeraldGreen">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Gross Revenue</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Rs. {stats.revenue}</p>
                    </div>
                    <div className="p-3 bg-emeraldGreen/10 rounded-xl text-emeraldGreen">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-850 dark:text-slate-100 mb-6 text-base">Monthly Revenue Flow</h3>
                    <div className="h-64 flex items-center justify-center">
                      <Bar data={monthlyRevenueData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-850 dark:text-slate-100 mb-6 text-base">Trip Categories division</h3>
                    <div className="h-64 flex items-center justify-center">
                      <Doughnut data={tripTypesData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 2: BOOKINGS TABLE */}
            {activeTab === 'Bookings' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg">Active Cab Bookings</h3>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="px-3 py-1 bg-emeraldGreen text-white font-bold rounded-lg hover:bg-emerald-600 text-xs flex items-center space-x-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Booking</span>
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{bookings.length} reservations</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600 dark:text-slate-350">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-700">
                      <tr>
                        <th className="p-4">Ref ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Route (Pickup → Drop)</th>
                        <th className="p-4">Vehicle Category</th>
                        <th className="p-4">Driver</th>
                        <th className="p-4">Fare</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                      {bookings.map((b) => (
                        <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{b.bookingId}</td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-900 dark:text-white">{b.customerDetails?.name}</p>
                            <p className="text-[11px] text-slate-400">{b.customerDetails?.phone}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{b.pickup}</p>
                            <p className="text-[11px] text-slate-400">→ {b.drop}</p>
                          </td>
                          <td className="p-4 font-medium">{b.vehicleCategory}</td>
                          <td className="p-4 text-xs font-semibold">
                            {b.driverAssigned ? (
                              <span className="text-emeraldGreen">{b.driverAssigned.name || b.driverAssigned}</span>
                            ) : (
                              <button 
                                onClick={() => setAssignModal({ open: true, bookingId: b._id || b.bookingId })}
                                className="text-amber-500 hover:underline flex items-center space-x-1"
                              >
                                <span>Assign Driver</span>
                              </button>
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-white">Rs. {b.estimatedFare}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              b.status === 'Completed' 
                                ? 'bg-emeraldGreen/10 text-emeraldGreen' 
                                : b.status === 'Assigned' 
                                  ? 'bg-blue-500/10 text-blue-500' 
                                  : b.status === 'Cancelled'
                                    ? 'bg-red-500/10 text-red-500'
                                    : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4 text-right flex justify-end space-x-2">
                            <button
                              onClick={() => handleInvoiceDownload(b._id || b.bookingId)}
                              className="p-1.5 text-slate-400 hover:text-emeraldGreen"
                              title="Download PDF Invoice"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(b._id, 'Completed')}
                                  className="p-1.5 text-slate-400 hover:text-emeraldGreen"
                                  title="Mark as Completed"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                                  className="p-1.5 text-slate-400 hover:text-red-500"
                                  title="Cancel Booking"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(b._id)}
                              className="p-1.5 text-slate-400 hover:text-red-500"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 3: DRIVERS */}
            {activeTab === 'Drivers' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg">Fleet Drivers</h3>
                  <button 
                    onClick={() => setShowDriverModal(true)}
                    className="px-3 py-1.5 bg-emeraldGreen text-white font-bold rounded-lg hover:bg-emerald-600 text-xs flex items-center space-x-1.5 shadow"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Driver</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drivers.map((drv) => (
                    <div key={drv._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white">{drv.name}</h4>
                          <p className="text-xs text-slate-450">{drv.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            drv.status === 'Available' ? 'bg-emeraldGreen/10 text-emeraldGreen' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {drv.status || 'Available'}
                          </span>
                          <button
                            onClick={() => handleDeleteDriver(drv._id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete Driver"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-405">
                        <p><strong>Phone:</strong> {drv.phone || 'N/A'}</p>
                        <p><strong>License:</strong> {drv.licenseNumber || 'N/A'}</p>
                        <p><strong>Assigned Cab:</strong> {drv.vehicleAssigned || 'None'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 4: VEHICLES */}
            {activeTab === 'Vehicles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg">Cab Fleet</h3>
                  <button 
                    onClick={() => setShowVehicleModal(true)}
                    className="px-3 py-1.5 bg-emeraldGreen text-white font-bold rounded-lg hover:bg-emerald-600 text-xs flex items-center space-x-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Cab</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((v) => (
                    <div key={v._id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between relative">
                      <div>
                        <div className="relative">
                          <img src={v.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'} alt={v.name} className="h-40 w-full object-cover" />
                          <button
                            onClick={() => handleDeleteVehicle(v._id)}
                            className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-slate-600 dark:text-slate-330 hover:text-red-500 transition-colors shadow-sm"
                            title="Delete Cab"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{v.name}</h4>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-bold">{v.category}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs border-y border-slate-100 dark:border-slate-700 py-2 text-slate-450">
                            <p><strong>{v.seatingCapacity}</strong> seats</p>
                            <p><strong>{v.luggageCapacity}</strong> bags</p>
                            <p>{v.acType}</p>
                          </div>
                          <div className="text-xs text-slate-500 pt-1">
                            <p><strong>Plate No:</strong> {v.plateNumber}</p>
                            <p><strong>Rate Per KM:</strong> Rs. {v.pricePerKm}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 5: LEADS & ENQUIRIES */}
            {activeTab === 'Leads' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg">Website Enquiries & Callback Requests</h3>
                    <button 
                      onClick={() => setShowLeadModal(true)}
                      className="px-3 py-1 bg-emeraldGreen text-white font-bold rounded-lg hover:bg-emerald-600 text-xs flex items-center space-x-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Lead</span>
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{enquiries.length} leads</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-655 dark:text-slate-350">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100 dark:border-slate-700">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Source Type</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                      {enquiries.map((e) => (
                        <tr key={e._id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{e.name}</td>
                          <td className="p-4">{e.phone}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-semibold">{e.source}</span>
                          </td>
                          <td className="p-4 max-w-xs truncate">{e.message || e.subject || 'Callback Request'}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              e.status === 'Resolved' ? 'bg-emeraldGreen/10 text-emeraldGreen' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="p-4 text-right flex justify-end space-x-2">
                            <button
                              onClick={() => handleDeleteLead(e._id)}
                              className="p-1.5 text-slate-400 hover:text-red-500"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 6: DESTINATIONS */}
            {activeTab === 'Destinations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg">South India Destinations</h3>
                  <button 
                    onClick={() => setShowDestModal(true)}
                    className="px-3 py-1.5 bg-emeraldGreen text-white font-bold rounded-lg hover:bg-emerald-600 text-xs flex items-center space-x-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Destination</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((dest) => (
                    <div key={dest._id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between relative transition-all duration-200">
                      <div>
                        <div className="relative">
                          <img src={dest.image || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=400'} alt={dest.name} className="h-40 w-full object-cover" />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                              onClick={() => openDestinationModal(dest)}
                              className="p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-slate-600 dark:text-slate-300 hover:text-emeraldGreen transition-colors shadow-sm"
                              title="Edit Destination"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDest(dest._id)}
                              className="p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors shadow-sm"
                              title="Delete Destination"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{dest.name}</h4>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-bold">{dest.state}</span>
                          </div>
                          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {dest.description}
                          </p>
                          <div className="text-xs text-slate-550 dark:text-slate-450 pt-1 border-t border-slate-100 dark:border-slate-700 mt-2">
                            <p><strong>Distance:</strong> {dest.distance || '150 km'}</p>
                            <p><strong>Est. Fare:</strong> Rs. {dest.estimatedFare || '0'}</p>
                            {dest.popularSpots && dest.popularSpots.length > 0 && (
                              <p className="truncate"><strong>Spots:</strong> {dest.popularSpots.join(', ')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 7: PACKAGES */}
            {activeTab === 'Packages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg">Tour Packages Options</h3>
                  <button 
                    onClick={() => openPackageModal()}
                    className="px-3 py-1.5 bg-emeraldGreen text-white font-bold rounded-lg hover:bg-emerald-600 text-xs flex items-center space-x-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Package</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <div key={pkg._id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between relative transition-all duration-200">
                      <div>
                        <div className="relative">
                          <img src={pkg.image || 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=400'} alt={pkg.name} className="h-40 w-full object-cover" />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                              onClick={() => openPackageModal(pkg)}
                              className="p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-slate-600 dark:text-slate-300 hover:text-emeraldGreen transition-colors shadow-sm"
                              title="Edit Package"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg._id)}
                              className="p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors shadow-sm"
                              title="Delete Package"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{pkg.name}</h4>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-bold">{pkg.category}</span>
                          </div>
                          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {pkg.description}
                          </p>
                          <div className="text-xs text-slate-550 dark:text-slate-450 pt-1 border-t border-slate-100 dark:border-slate-700 mt-2 space-y-1">
                            <p><strong>Duration:</strong> {pkg.duration}</p>
                            <p><strong>Vehicle Category:</strong> {pkg.vehicleCategory}</p>
                            <p><strong>Accommodation:</strong> {pkg.accommodation ? 'Included' : 'Not Included'}</p>
                            <p><strong>Price:</strong> <span className="font-bold text-emeraldGreen text-sm">Rs. {pkg.price}</span></p>
                            {pkg.placesCovered && pkg.placesCovered.length > 0 && (
                              <p className="truncate"><strong>Places:</strong> {pkg.placesCovered.join(', ')}</p>
                            )}
                            {pkg.highlights && pkg.highlights.length > 0 && (
                              <p className="truncate"><strong>Highlights:</strong> {pkg.highlights.join(', ')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* --- ADD DRIVER POPUP MODAL --- */}
      {showDriverModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3">
              Add New driver
            </h3>
            <form onSubmit={handleAddDriver} className="space-y-3.5">
              <input 
                type="text" 
                placeholder="Driver Full Name" 
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                className="form-input text-xs" 
                required
              />
              <input 
                type="email" 
                placeholder="Driver Email Address" 
                value={newDriver.email}
                onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                className="form-input text-xs" 
                required
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={newDriver.phone}
                onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                className="form-input text-xs" 
                required
              />
              <input 
                type="text" 
                placeholder="License Number (e.g. DL-TN43)" 
                value={newDriver.licenseNumber}
                onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                className="form-input text-xs" 
                required
              />
              <input 
                type="text" 
                placeholder="Assigned Vehicle Plate (e.g. TN-43-Y-1234)" 
                value={newDriver.vehicleAssigned}
                onChange={(e) => setNewDriver({ ...newDriver, vehicleAssigned: e.target.value })}
                className="form-input text-xs" 
              />
              
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowDriverModal(false)} className="w-1/2 btn-secondary py-2 text-xs">Cancel</button>
                <button type="submit" className="w-1/2 btn-primary py-2 text-xs">Save Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD VEHICLE POPUP MODAL --- */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3">
              Add New Cab
            </h3>
            <form onSubmit={handleAddVehicle} className="space-y-3.5">
              <input 
                type="text" 
                placeholder="Vehicle Model Name" 
                value={newVehicle.name}
                onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                className="form-input text-xs" 
                required
              />
              <select 
                value={newVehicle.category}
                onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                className="form-input text-xs"
              >
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="Innova Crysta">Innova Crysta</option>
                <option value="Tempo Traveller">Tempo Traveller</option>
                <option value="Luxury Vehicles">Luxury Vehicle</option>
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  placeholder="Seating Capacity" 
                  value={newVehicle.seatingCapacity}
                  onChange={(e) => setNewVehicle({ ...newVehicle, seatingCapacity: Number(e.target.value) })}
                  className="form-input text-xs" 
                  required
                />
                <input 
                  type="number" 
                  placeholder="Luggage Capacity" 
                  value={newVehicle.luggageCapacity}
                  onChange={(e) => setNewVehicle({ ...newVehicle, luggageCapacity: Number(e.target.value) })}
                  className="form-input text-xs" 
                  required
                />
              </div>

              <input 
                type="number" 
                placeholder="Rate per KM (Rs.)" 
                value={newVehicle.pricePerKm}
                onChange={(e) => setNewVehicle({ ...newVehicle, pricePerKm: Number(e.target.value) })}
                className="form-input text-xs" 
                required
              />
              <input 
                type="text" 
                placeholder="Plate Number (e.g. TN-43-A-9999)" 
                value={newVehicle.plateNumber}
                onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                className="form-input text-xs" 
                required
              />

              {/* Cab Photo Upload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Cab Photo</label>
                <div className="flex flex-col space-y-2 mt-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewVehicle({ ...newVehicle, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-xs file:font-semibold
                      file:bg-emeraldGreen/10 file:text-emeraldGreen
                      hover:file:bg-emeraldGreen/20 cursor-pointer"
                  />
                  {newVehicle.image && (
                    <div className="relative mt-2 h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={newVehicle.image} alt="Cab Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewVehicle({ ...newVehicle, image: '' })}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowVehicleModal(false)} className="w-1/2 btn-secondary py-2 text-xs">Cancel</button>
                <button type="submit" className="w-1/2 btn-primary py-2 text-xs">Save Cab</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ASSIGN DRIVER MODAL --- */}
      {assignModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3">
              Assign Driver to Ride
            </h3>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Available Drivers</label>
                <select 
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="form-input text-xs"
                  required
                >
                  <option value="">Select a Driver</option>
                  {drivers.filter(d => d.status === 'Available').map(d => (
                    <option key={d._id} value={d._id}>{d.name} ({d.vehicleAssigned})</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setAssignModal({ open: false, bookingId: null })} className="w-1/2 btn-secondary py-2 text-xs">Cancel</button>
                <button type="submit" className="w-1/2 btn-primary py-2 text-xs">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD BOOKING POPUP MODAL --- */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3">
              Add New Booking
            </h3>
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Customer Name</label>
                  <input 
                    type="text" 
                    placeholder="Customer Name" 
                    value={newBooking.customerName}
                    onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                    className="form-input text-xs" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Customer Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Customer Phone" 
                    value={newBooking.customerPhone}
                    onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
                    className="form-input text-xs" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Customer Email</label>
                <input 
                  type="email" 
                  placeholder="Customer Email" 
                  value={newBooking.customerEmail}
                  onChange={(e) => setNewBooking({ ...newBooking, customerEmail: e.target.value })}
                  className="form-input text-xs" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Pickup Location</label>
                  <input 
                    type="text" 
                    placeholder="Pickup Location" 
                    value={newBooking.pickup}
                    onChange={(e) => setNewBooking({ ...newBooking, pickup: e.target.value })}
                    className="form-input text-xs" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Drop Location</label>
                  <input 
                    type="text" 
                    placeholder="Drop Location" 
                    value={newBooking.drop}
                    onChange={(e) => setNewBooking({ ...newBooking, drop: e.target.value })}
                    className="form-input text-xs" 
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Booking Type</label>
                  <select 
                    value={newBooking.bookingType}
                    onChange={(e) => setNewBooking({ ...newBooking, bookingType: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="Local City Rides">Local City Rides</option>
                    <option value="Airport Transfers">Airport Transfers</option>
                    <option value="Outstation Trips">Outstation Trips</option>
                    <option value="Round Trip Taxi">Round Trip Taxi</option>
                    <option value="Tour Package">Tour Package</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Vehicle Category</label>
                  <select 
                    value={newBooking.vehicleCategory}
                    onChange={(e) => setNewBooking({ ...newBooking, vehicleCategory: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Innova Crysta">Innova Crysta</option>
                    <option value="Tempo Traveller">Tempo Traveller</option>
                    <option value="Luxury Vehicles">Luxury Vehicle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={newBooking.dateTime}
                    onChange={(e) => setNewBooking({ ...newBooking, dateTime: e.target.value })}
                    className="form-input text-xs" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Passengers</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newBooking.passengers}
                    onChange={(e) => setNewBooking({ ...newBooking, passengers: Number(e.target.value) })}
                    className="form-input text-xs" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Est. Fare (Rs.)</label>
                  <input 
                    type="number" 
                    value={newBooking.estimatedFare}
                    onChange={(e) => setNewBooking({ ...newBooking, estimatedFare: Number(e.target.value) })}
                    className="form-input text-xs" 
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowBookingModal(false)} className="w-1/2 btn-secondary py-2 text-xs">Cancel</button>
                <button type="submit" className="w-1/2 btn-primary py-2 text-xs">Save Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD LEAD POPUP MODAL --- */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3">
              Add New Enquiry Lead
            </h3>
            <form onSubmit={handleAddLead} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Customer Name</label>
                <input 
                  type="text" 
                  placeholder="Customer Name" 
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="form-input text-xs" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="form-input text-xs" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Source</label>
                <select 
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  className="form-input text-xs"
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Call Request">Call Request</option>
                  <option value="WhatsApp Lead">WhatsApp Lead</option>
                  <option value="Contact Form Lead">Contact Form Lead</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Message / Requirement Details</label>
                <textarea 
                  placeholder="Describe trip details, dates, passenger count, etc." 
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  className="form-input text-xs h-24 resize-none" 
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowLeadModal(false)} className="w-1/2 btn-secondary py-2 text-xs">Cancel</button>
                <button type="submit" className="w-1/2 btn-primary py-2 text-xs">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD DESTINATION POPUP MODAL --- */}
      {showDestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3">
              {editingDestination ? 'Update Destination' : 'Add New Destination'}
            </h3>
            <form onSubmit={handleSaveDest} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Destination Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ooty, Munnar" 
                  value={newDest.name}
                  onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                  className="form-input text-xs" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">State Location</label>
                <select 
                  value={newDest.state}
                  onChange={(e) => setNewDest({ ...newDest, state: e.target.value })}
                  className="form-input text-xs"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Destination Photo</label>
                <div className="flex flex-col space-y-2 mt-1">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewDest({ ...newDest, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-xs file:font-semibold
                      file:bg-emeraldGreen/10 file:text-emeraldGreen
                      hover:file:bg-emeraldGreen/20 cursor-pointer"
                  />
                  {newDest.image && (
                    <div className="relative mt-2 h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={newDest.image} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewDest({ ...newDest, image: '' })}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Distance (e.g. 250 km)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 120 km" 
                    value={newDest.distance}
                    onChange={(e) => setNewDest({ ...newDest, distance: e.target.value })}
                    className="form-input text-xs" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Est. Taxi Fare (Rs.)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 4300" 
                    value={newDest.estimatedFare}
                    onChange={(e) => setNewDest({ ...newDest, estimatedFare: e.target.value })}
                    className="form-input text-xs" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Popular Spots (comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="Spot 1, Spot 2, Spot 3" 
                  value={newDest.popularSpots}
                  onChange={(e) => setNewDest({ ...newDest, popularSpots: e.target.value })}
                  className="form-input text-xs" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label>
                <textarea 
                  placeholder="Describe key attractions and sightseeing notes..." 
                  value={newDest.description}
                  onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                  className="form-input text-xs h-20 resize-none" 
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={resetDestinationForm} className="w-1/2 btn-secondary py-2 text-xs">Cancel</button>
                <button type="submit" className="w-1/2 btn-primary py-2 text-xs">{editingDestination ? 'Update Destination' : 'Save Destination'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD PACKAGE POPUP MODAL --- */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3">
              {editingPackage ? 'Update Tour Package' : 'Add New Tour Package'}
            </h3>
            <form onSubmit={handleSavePackage} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Package Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ooty Weekend Special" 
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="form-input text-xs" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Package Category</label>
                <select 
                  value={newPackage.category}
                  onChange={(e) => setNewPackage({ ...newPackage, category: e.target.value })}
                  className="form-input text-xs"
                >
                  <option value="Ooty Package">Ooty Package</option>
                  <option value="Kerala Package">Kerala Package</option>
                  <option value="Karnataka Package">Karnataka Package</option>
                  <option value="South India Package">South India Package</option>
                  <option value="Customized Tour Package">Customized Tour Package</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Duration (e.g. 3 Days / 2 Nights)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 3 Days / 2 Nights" 
                  value={newPackage.duration}
                  onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                  className="form-input text-xs" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Price (Rs.)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 8999" 
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    className="form-input text-xs" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Vehicle Category</label>
                  <select 
                    value={newPackage.vehicleCategory}
                    onChange={(e) => setNewPackage({ ...newPackage, vehicleCategory: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV">SUV</option>
                    <option value="Innova Crysta">Innova Crysta</option>
                    <option value="Tempo Traveller">Tempo Traveller</option>
                    <option value="Luxury Vehicles">Luxury Vehicle</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 py-1">
                <input 
                  type="checkbox" 
                  id="accommodation"
                  checked={newPackage.accommodation}
                  onChange={(e) => setNewPackage({ ...newPackage, accommodation: e.target.checked })}
                  className="w-4 h-4 rounded text-emeraldGreen focus:ring-emeraldGreen border-slate-300 dark:border-slate-700" 
                />
                <label htmlFor="accommodation" className="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
                  Accommodation Included
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Places Covered (comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="Spot 1, Spot 2, Spot 3" 
                  value={newPackage.placesCovered}
                  onChange={(e) => setNewPackage({ ...newPackage, placesCovered: e.target.value })}
                  className="form-input text-xs" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Highlights (comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="Highlight 1, Highlight 2" 
                  value={newPackage.highlights}
                  onChange={(e) => setNewPackage({ ...newPackage, highlights: e.target.value })}
                  className="form-input text-xs" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Package Photo</label>
                <div className="flex flex-col space-y-2 mt-1">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewPackage({ ...newPackage, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-xs file:font-semibold
                      file:bg-emeraldGreen/10 file:text-emeraldGreen
                      hover:file:bg-emeraldGreen/20 cursor-pointer"
                  />
                  {newPackage.image && (
                    <div className="relative mt-2 h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={newPackage.image} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewPackage({ ...newPackage, image: '' })}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label>
                <textarea 
                  placeholder="Describe the package itinerary and experience..." 
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  className="form-input text-xs h-20 resize-none" 
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={resetPackageForm} className="w-1/2 btn-secondary py-2 text-xs">Cancel</button>
                <button type="submit" className="w-1/2 btn-primary py-2 text-xs">{editingPackage ? 'Update Package' : 'Save Package'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
