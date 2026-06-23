import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateBookingForm, setBookingStep } from '../store/bookingSlice';
import { useTranslation } from '../context/LanguageContext';
import { Users, Briefcase, Snowflake, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Fleet() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackVehicles = [
    { _id: 'v1', name: 'Suzuki Swift / Hyundai i10', category: 'Hatchback', seatingCapacity: 4, luggageCapacity: 1, acType: 'AC', pricePerKm: 12, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600' },
    { _id: 'v2', name: 'Suzuki Dzire / Toyota Etios', category: 'Sedan', seatingCapacity: 4, luggageCapacity: 2, acType: 'AC', pricePerKm: 14, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600' },
    { _id: 'v3', name: 'Mahindra XUV500 / Ertiga', category: 'SUV', seatingCapacity: 7, luggageCapacity: 3, acType: 'AC', pricePerKm: 19, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600' },
    { _id: 'v4', name: 'Toyota Innova Crysta', category: 'Innova Crysta', seatingCapacity: 7, luggageCapacity: 4, acType: 'AC', pricePerKm: 22, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600' },
    { _id: 'v5', name: 'Force Traveller (Premium)', category: 'Tempo Traveller', seatingCapacity: 12, luggageCapacity: 8, acType: 'AC', pricePerKm: 26, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600' },
    { _id: 'v6', name: 'Mercedes E-Class / BMW 5', category: 'Luxury Vehicles', seatingCapacity: 4, luggageCapacity: 3, acType: 'AC', pricePerKm: 45, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600' }
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('/api/vehicles');
        if (response.data && response.data.success && response.data.data.length > 0) {
          setVehicles(response.data.data);
        } else {
          setVehicles(fallbackVehicles);
        }
      } catch (error) {
        console.error('Error fetching vehicles, using fallbacks', error);
        setVehicles(fallbackVehicles);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleSelectVehicle = (categoryName) => {
    dispatch(updateBookingForm({
      vehicleCategory: categoryName
    }));
    dispatch(setBookingStep(1));
    navigate('/booking');
  };

  return (
    <div className="bg-lightGray dark:bg-darkBlue min-h-screen transition-colors duration-300 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800')` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display font-extrabold text-4xl">{t('navFleet')}</h1>
          <p className="mt-2 text-slate-400">Choose from our verified high-comfort vehicle fleet</p>
        </div>
      </div>

      {/* Fleet Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emeraldGreen"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <div 
                key={v._id}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={v.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'} 
                      alt={v.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-darkBlue/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                      {v.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{v.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">Inter-state tourist clearance permit active</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-700 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="w-5 h-5 text-emeraldGreen mb-1" />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t('seatingCap')}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{v.seatingCapacity} Seats</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Briefcase className="w-5 h-5 text-emeraldGreen mb-1" />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t('luggageCap')}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{v.luggageCapacity} Bags</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Snowflake className="w-5 h-5 text-emeraldGreen mb-1" />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t('acNonAc')}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{v.acType || 'AC'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <p className="text-xs text-slate-400">{t('pricePerKm')}</p>
                        <p className="text-xl font-extrabold text-emeraldGreen">Rs. {v.pricePerKm}</p>
                      </div>
                      <div className="text-xs text-slate-400 text-right">
                        <p>Driver Beta: Included</p>
                        <p>Tolls/Parking: Extra</p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleSelectVehicle(v.category)}
                    className="w-full btn-primary py-2.5 text-sm flex items-center justify-center space-x-2"
                  >
                    <span>Book {v.category}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
