import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateBookingForm, setBookingStep } from '../store/bookingSlice';
import { useTranslation } from '../context/LanguageContext';
import { MapPin, Calendar, Users, Car, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function BookingForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentBooking = useSelector((state) => state.booking.currentBooking);

  const [form, setForm] = useState({
    pickup: currentBooking.pickup || '',
    drop: currentBooking.drop || '',
    bookingType: currentBooking.bookingType || 'One-Way Taxi',
    dateTime: currentBooking.dateTime || '',
    passengers: currentBooking.passengers || 1,
    vehicleCategory: currentBooking.vehicleCategory || 'Sedan'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pickup || !form.drop || !form.dateTime) {
      alert('Please fill in Pickup, Drop, and Date/Time fields');
      return;
    }

    setLoading(true);
    try {
      // Fetch dynamic fare estimate from backend
      const response = await axios.post('/api/bookings/estimate', {
        pickup: form.pickup,
        drop: form.drop,
        vehicleCategory: form.vehicleCategory,
        bookingType: form.bookingType
      });

      if (response.data && response.data.success) {
        const { estimatedFare, distance } = response.data;
        
        // Dispatch to Redux Store
        dispatch(updateBookingForm({
          ...form,
          estimatedFare,
          distance
        }));
        
        // Set to Step 3 (Vehicle selection screen or Step 4 checkout)
        dispatch(setBookingStep(3));
        navigate('/booking');
      }
    } catch (error) {
      console.error('Fare estimation error, falling back to client-side calc', error);
      // Fallback calculation if server isn't up
      const rates = { Hatchback: 12, Sedan: 14, SUV: 19, 'Innova Crysta': 22, 'Tempo Traveller': 26, 'Luxury Vehicles': 45 };
      const rate = rates[form.vehicleCategory] || 15;
      const distance = 150; // default mock
      const total = distance * rate + 400; // route fare + hill charges

      dispatch(updateBookingForm({
        ...form,
        estimatedFare: total,
        distance: `${distance} km`
      }));
      dispatch(setBookingStep(3));
      navigate('/booking');
    } finally {
      setLoading(false);
    }
  };

  const vehicleCategories = ['Sedan', 'Hatchback', 'SUV', 'Innova Crysta', 'Tempo Traveller', 'Luxury Vehicles'];

  return (
    <div className="w-full max-w-4xl mx-auto -mt-16 relative z-30 px-4">
      <form 
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl shadow-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border border-slate-200 dark:border-slate-800"
      >
        
        {/* Journey Type */}
        <div className="md:col-span-2 lg:col-span-3 flex border-b border-slate-100 dark:border-slate-800 pb-4 mb-2 space-x-4 overflow-x-auto">
          {['One-Way Taxi', 'Round Trip Taxi', 'Local City Rides', 'Airport Transfers', 'Outstation Trips'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm({ ...form, bookingType: type })}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                form.bookingType === type
                  ? 'bg-emeraldGreen text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Pickup Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-emeraldGreen" />
            <span>{t('pickupLoc')}</span>
          </label>
          <input
            type="text"
            name="pickup"
            value={form.pickup}
            onChange={handleChange}
            placeholder="e.g. Coimbatore Airport or Ooty"
            className="form-input"
            required
          />
        </div>

        {/* Drop Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-emeraldGreen" />
            <span>{t('dropLoc')}</span>
          </label>
          <input
            type="text"
            name="drop"
            value={form.drop}
            onChange={handleChange}
            placeholder="e.g. Ooty Head Office or Munnar"
            className="form-input"
            required
          />
        </div>

        {/* Date and Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-emeraldGreen" />
            <span>{t('dateTime')}</span>
          </label>
          <input
            type="datetime-local"
            name="dateTime"
            value={form.dateTime}
            onChange={handleChange}
            className="form-input text-sm"
            required
          />
        </div>

        {/* Number of Passengers */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-emeraldGreen" />
            <span>{t('passengers')}</span>
          </label>
          <select
            name="passengers"
            value={form.passengers}
            onChange={handleChange}
            className="form-input"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <option key={n} value={n}>{n} Pax</option>
            ))}
          </select>
        </div>

        {/* Vehicle Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Car className="w-3.5 h-3.5 text-emeraldGreen" />
            <span>{t('vehicleType')}</span>
          </label>
          <select
            name="vehicleCategory"
            value={form.vehicleCategory}
            onChange={handleChange}
            className="form-input"
          >
            {vehicleCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 flex items-center justify-center space-x-2 text-base"
          >
            <span>{loading ? t('submitting') : t('estimateFareBtn')}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>

      </form>
    </div>
  );
}
