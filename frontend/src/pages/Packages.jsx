import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateBookingForm, setBookingStep } from '../store/bookingSlice';
import { useTranslation } from '../context/LanguageContext';
import { Calendar, MapPin, Car, Coffee, Send, Check } from 'lucide-react';
import axios from 'axios';

export default function Packages() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Custom request state
  const [customForm, setCustomForm] = useState({
    name: '',
    phone: '',
    places: '',
    duration: '3 Days',
    vehicle: 'Sedan',
    accommodation: false
  });
  const [submitted, setSubmitted] = useState(false);

  const fallbackPkgs = [
    { _id: 'p1', name: 'Ooty Hills Escape Tour', category: 'Ooty Package', duration: '3 Days / 2 Nights', placesCovered: ['Ooty Lake', 'Botanical Gardens', 'Doddabetta Peak', 'Coonoor SIMS Park', 'Pykara Waterfalls'], vehicleCategory: 'Sedan', accommodation: true, price: 8999, highlights: ['Toy Train ride booking support', 'Local tea garden walks', 'Private cab for sightseeing'], image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600' },
    { _id: 'p2', name: 'Misty Munnar Tea Trail', category: 'Kerala Package', duration: '4 Days / 3 Nights', placesCovered: ['Munnar tea gardens', 'Eravikulam National Park', 'Mattupetty Dam', 'Alleppey Backwaters'], vehicleCategory: 'SUV', accommodation: true, price: 15499, highlights: ['Spice plantation visits', 'Alleppey day boat cruise', 'Dedicated driver for entire tour'], image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600' },
    { _id: 'p3', name: 'Royal Mysore & Coorg Coffee Trail', category: 'Karnataka Package', duration: '5 Days / 4 Nights', placesCovered: ['Mysore Palace', 'Chamundi Hills', 'Coorg Abbey Falls', 'Raja Seat', 'Bylakuppe Golden Temple'], vehicleCategory: 'Innova Crysta', accommodation: true, price: 21999, highlights: ['Mysore Palace lighting tour', 'Elephant camp interactions', 'Premium Innova Crysta booking'], image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=600' },
    { _id: 'p4', name: 'Grand South India Heritage Tour', category: 'South India Package', duration: '8 Days / 7 Nights', placesCovered: ['Ooty Hills', 'Kodaikanal Lake', 'Madurai Temple', 'Rameswaram Bridge', 'Kanyakumari Sunset Point'], vehicleCategory: 'Tempo Traveller', accommodation: true, price: 34999, highlights: ['Multi-state travel permission included', 'Covering major cultural monuments', 'Group Tempo Traveller transportation'], image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600' }
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/api/packages');
        if (response.data && response.data.success && response.data.data.length > 0) {
          setPackages(response.data.data);
        } else {
          setPackages(fallbackPkgs);
        }
      } catch (error) {
        console.error('Error fetching packages, utilizing fallbacks', error);
        setPackages(fallbackPkgs);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleBookPackage = (pkg) => {
    dispatch(updateBookingForm({
      pickup: 'Coimbatore Airport/Railway Station',
      drop: `${pkg.name} (${pkg.duration})`,
      bookingType: 'Tour Package',
      vehicleCategory: pkg.vehicleCategory,
      estimatedFare: pkg.price
    }));
    dispatch(setBookingStep(1));
    navigate('/booking');
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customForm.name || !customForm.phone || !customForm.places) {
      alert('Please fill in Name, Phone, and Destinations.');
      return;
    }

    try {
      await axios.post('/api/enquiries', {
        name: customForm.name,
        phone: customForm.phone,
        subject: `Custom Tour Request (${customForm.duration})`,
        message: `Destinations: ${customForm.places}. Vehicle: ${customForm.vehicle}. Acc: ${customForm.accommodation ? 'Yes' : 'No'}.`,
        source: 'Website Enquiry'
      });
      setSubmitted(true);
      
      // Auto open WhatsApp with pre-filled text
      const msg = `Hello Ooty Travels Designer. I would like to request a custom package: Name: ${customForm.name}, Phone: ${customForm.phone}, Destinations: ${customForm.places}, Duration: ${customForm.duration}, Vehicle: ${customForm.vehicle}, Accommodation: ${customForm.accommodation ? 'Required' : 'Not required'}.`;
      setTimeout(() => {
        window.open(`https://wa.me/918778595023?text=${encodeURIComponent(msg)}`, '_blank');
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting custom package', error);
      // Fallback open whatsapp directly
      const msg = `Hello Ooty Travels Designer. I would like to request a custom package: Name: ${customForm.name}, Phone: ${customForm.phone}, Destinations: ${customForm.places}, Duration: ${customForm.duration}, Vehicle: ${customForm.vehicle}, Accommodation: ${customForm.accommodation ? 'Required' : 'Not required'}.`;
      window.open(`https://wa.me/918778595023?text=${encodeURIComponent(msg)}`, '_blank');
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-lightGray dark:bg-darkBlue min-h-screen transition-colors duration-300 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800')` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display font-extrabold text-4xl">{t('navPackages')}</h1>
          <p className="mt-2 text-slate-400">Curated tourism plans for Ooty, Kerala, and Karnataka</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* Packages Grid */}
        <div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emeraldGreen"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {packages.map((pkg) => (
                <div 
                  key={pkg._id} 
                  className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-48 h-56 md:h-full relative shrink-0">
                    <img 
                      src={pkg.image || 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600'} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-emeraldGreen text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {pkg.category}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white leading-tight">
                        {pkg.name}
                      </h3>
                      
                      {/* Metas */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-emeraldGreen" />
                          <span>{pkg.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Car className="w-3.5 h-3.5 text-emeraldGreen" />
                          <span>Vehicle: {pkg.vehicleCategory}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Coffee className="w-3.5 h-3.5 text-emeraldGreen" />
                          <span>Acc: {pkg.accommodation ? 'Included' : 'Optional'}</span>
                        </span>
                      </div>

                      {/* Places covered tags */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {pkg.placesCovered && pkg.placesCovered.map((place, idx) => (
                          <span 
                            key={idx}
                            className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-350 text-[10px] px-2 py-0.5 rounded font-medium flex items-center space-x-1"
                          >
                            <MapPin className="w-2.5 h-2.5 text-emeraldGreen" />
                            <span>{place}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Starting Price</p>
                        <p className="text-xl font-extrabold text-emeraldGreen">Rs. {pkg.price}</p>
                      </div>
                      <button
                        onClick={() => handleBookPackage(pkg)}
                        className="btn-primary py-2 px-5 text-sm"
                      >
                        Book Package
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customized package builder */}
        <section className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800')` }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white">
                Customize Your South India Tour
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                Don't want our standard packages? Plan your own trip across Ooty, Kerala, or Karnataka! Fill out your desired destinations, pick a vehicle, and our local travel specialists will construct a customized quotation for you instantly.
              </p>
              <div className="space-y-2 text-sm text-slate-350">
                <p>✓ Customized pricing according to season offers</p>
                <p>✓ Multi-lingual drivers specializing in mountain pathways</p>
                <p>✓ Real-time support throughout your tour itinerary</p>
              </div>
            </div>

            {/* Custom Request Form */}
            <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-6 md:p-8 rounded-2xl shadow-xl">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emeraldGreen/10 text-emeraldGreen rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl">Request Submitted!</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                    We've logged your request. You're now being redirected to chat with our travel agent on WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Name</label>
                      <input 
                        type="text" 
                        value={customForm.name}
                        onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                        placeholder="Your Name" 
                        className="form-input text-sm py-2.5" 
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Phone Number</label>
                      <input 
                        type="tel" 
                        value={customForm.phone}
                        onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                        placeholder="Mobile Number" 
                        className="form-input text-sm py-2.5" 
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Places You Want to Visit</label>
                    <input 
                      type="text" 
                      value={customForm.places}
                      onChange={(e) => setCustomForm({ ...customForm, places: e.target.value })}
                      placeholder="e.g. Ooty, Munnar, Wayanad" 
                      className="form-input text-sm py-2.5" 
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Duration</label>
                      <select 
                        value={customForm.duration}
                        onChange={(e) => setCustomForm({ ...customForm, duration: e.target.value })}
                        className="form-input text-sm py-2.5"
                      >
                        <option value="2 Days">2 Days / 1 Night</option>
                        <option value="3 Days">3 Days / 2 Nights</option>
                        <option value="4 Days">4 Days / 3 Nights</option>
                        <option value="5 Days">5 Days / 4 Nights</option>
                        <option value="7 Days+">1 Week or More</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Vehicle Type</label>
                      <select 
                        value={customForm.vehicle}
                        onChange={(e) => setCustomForm({ ...customForm, vehicle: e.target.value })}
                        className="form-input text-sm py-2.5"
                      >
                        <option value="Hatchback">Hatchback (Budget)</option>
                        <option value="Sedan">Sedan (Comfort)</option>
                        <option value="SUV">SUV (Family)</option>
                        <option value="Innova Crysta">Innova Crysta (Premium)</option>
                        <option value="Tempo Traveller">Tempo Traveller (Group)</option>
                        <option value="Luxury Vehicles">Luxury Vehicle</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="acc"
                      checked={customForm.accommodation}
                      onChange={(e) => setCustomForm({ ...customForm, accommodation: e.target.checked })}
                      className="w-4 h-4 text-emeraldGreen focus:ring-emeraldGreen border-slate-300 rounded" 
                    />
                    <label htmlFor="acc" className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                      Need Hotel/Cottage Accommodation Support?
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary py-3 flex items-center justify-center space-x-2 text-sm mt-4"
                  >
                    <span>Request Custom Quote</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
