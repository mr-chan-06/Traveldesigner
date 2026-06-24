import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateBookingForm, setBookingStep } from '../store/bookingSlice';
import { useTranslation } from '../context/LanguageContext';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Destinations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Tamil Nadu');
  const [destList, setDestList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback destinations data if server API fails
  const fallbackDests = [
    // Tamil Nadu
    { _id: 'tn_1', name: 'Ooty', state: 'Tamil Nadu', distance: '0 km', estimatedFare: 0, image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600', description: 'The Queen of Hill Stations, featuring beautiful botanical gardens, serene lakes, and expansive tea plantations.' },
    { _id: 'tn_2', name: 'Kodaikanal', state: 'Tamil Nadu', distance: '250 km', estimatedFare: 4300, image: 'https://images.unsplash.com/photo-1612456225451-bb8d10d0131d?auto=format&fit=crop&q=80&w=600', description: 'The Princess of Hill Stations, popular for Kodaikanal Lake, misty valleys, pine forests and pleasant walks.' },
    { _id: 'tn_3', name: 'Coimbatore', state: 'Tamil Nadu', distance: '85 km', estimatedFare: 2200, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=600', description: 'The Manchester of South India, major transit hub for Ooty travelers arriving via flight or train.' },
    { _id: 'tn_4', name: 'Chennai', state: 'Tamil Nadu', distance: '550 km', estimatedFare: 9500, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=600', description: 'State capital, connecting Ooty Travels users with metropolitan hubs and luxury taxi drops.' },
    { _id: 'tn_5', name: 'Madurai', state: 'Tamil Nadu', distance: '300 km', estimatedFare: 5100, image: 'https://images.unsplash.com/photo-1600100397608-f010e42197be?auto=format&fit=crop&q=80&w=600', description: 'The temple city, famous for the Meenakshi Amman Temple and rich Tamil cultural heritage.' },
    { _id: 'tn_6', name: 'Rameswaram', state: 'Tamil Nadu', distance: '470 km', estimatedFare: 8200, image: 'https://images.unsplash.com/photo-1596701062351-dfc799c04ad0?auto=format&fit=crop&q=80&w=600', description: 'Holy island city, popular for Pamban Bridge and pristine beaches.' },
    { _id: 'tn_7', name: 'Kanyakumari', state: 'Tamil Nadu', distance: '530 km', estimatedFare: 9200, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600', description: 'The southernmost tip of mainland India, where three seas meet, famous for sunrise views.' },
    
    // Kerala
    { _id: 'kl_1', name: 'Munnar', state: 'Kerala', distance: '240 km', estimatedFare: 4200, image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600', description: 'Breathtaking hill station covered in tea gardens, mist-capped mountains, and gorgeous wildlife reserves.' },
    { _id: 'kl_2', name: 'Kochi', state: 'Kerala', distance: '280 km', estimatedFare: 4900, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=600', description: 'Historic port city with Chinese fishing nets, Jewish town, and premium airport terminals.' },
    { _id: 'kl_3', name: 'Alleppey', state: 'Kerala', distance: '320 km', estimatedFare: 5600, image: 'https://images.unsplash.com/photo-1593693411515-c202e974fe08?auto=format&fit=crop&q=80&w=600', description: 'Famous for houseboat cruises through the Venice of the East network of backwaters.' },
    { _id: 'kl_4', name: 'Wayanad', state: 'Kerala', distance: '110 km', estimatedFare: 2500, image: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&q=80&w=600', description: 'Spices plantations, waterfalls, caves and deep evergreen forests.' },
    { _id: 'kl_5', name: 'Thekkady', state: 'Kerala', distance: '340 km', estimatedFare: 5900, image: 'https://images.unsplash.com/photo-1590577976322-3d2d6e2130de?auto=format&fit=crop&q=80&w=600', description: 'Periyar National Park, spice market trails, and bamboo rafting.' },
    { _id: 'kl_6', name: 'Vagamon', state: 'Kerala', distance: '360 km', estimatedFare: 6200, image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=600', description: 'Quiet pine forests, green meadows, and misty tea estate trails.' },

    // Karnataka
    { _id: 'ka_1', name: 'Bangalore', state: 'Karnataka', distance: '270 km', estimatedFare: 4800, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=600', description: 'The Garden City & IT Hub, connecting tourists with premium highway rides directly to Ooty.' },
    { _id: 'ka_2', name: 'Mysore', state: 'Karnataka', distance: '125 km', estimatedFare: 2200, image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=600', description: 'Famous for royal palaces, rich heritage, and sandalwood gardens.' },
    { _id: 'ka_3', name: 'Coorg', state: 'Karnataka', distance: '310 km', estimatedFare: 5500, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=600', description: 'Scotland of India, smelling of fresh coffee, orange orchards, and beautiful mountain peaks.' },
    { _id: 'ka_4', name: 'Chikmagalur', state: 'Karnataka', distance: '350 km', estimatedFare: 6100, image: 'https://images.unsplash.com/photo-1616190419596-e2839e7380d7?auto=format&fit=crop&q=80&w=600', description: 'Birthplace of coffee in India, popular for Mullayanagiri peaks.' },
    { _id: 'ka_5', name: 'Hampi', state: 'Karnataka', distance: '580 km', estimatedFare: 9900, image: 'https://images.unsplash.com/photo-1600100398864-cf3d75c5ba0d?auto=format&fit=crop&q=80&w=600', description: 'UNESCO world heritage site, containing beautiful historical stone ruins of the Vijayanagara Empire.' }
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/api/destinations');
        if (response.data && response.data.success && response.data.data.length > 0) {
          setDestList(response.data.data);
        } else {
          setDestList(fallbackDests);
        }
      } catch (error) {
        console.error('Error fetching destinations, utilizing fallbacks', error);
        setDestList(fallbackDests);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const handleBookNow = (destName) => {
    // Fill Drop location in Redux booking state
    dispatch(updateBookingForm({
      pickup: 'Coimbatore Airport (CJB)',
      drop: destName,
      bookingType: 'Outstation Trips'
    }));
    dispatch(setBookingStep(1));
    navigate('/booking');
  };

  const filteredDests = destList.filter(d => d.state === activeTab);

  return (
    <div className="bg-lightGray dark:bg-darkBlue min-h-screen transition-colors duration-300 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800')` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display font-extrabold text-4xl">{t('navDestinations')}</h1>
          <p className="mt-2 text-slate-400">Explore key travel getaways across South India</p>
        </div>
      </div>

      {/* Tabs / Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-center border-b border-slate-200 dark:border-slate-700">
          {['Tamil Nadu', 'Kerala', 'Karnataka'].map((state) => (
            <button
              key={state}
              onClick={() => setActiveTab(state)}
              className={`px-6 py-4 font-display font-bold text-base md:text-lg border-b-2 transition-all ${
                activeTab === state
                  ? 'border-emeraldGreen text-emeraldGreen'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-emeraldGreen'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emeraldGreen"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filteredDests.map((dest) => (
              <div 
                key={dest._id}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-emeraldGreen text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {dest.state}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <MapPin className="w-5 h-5 text-emeraldGreen" />
                      <span>{dest.name}</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {dest.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Navigation className="w-4 h-4 text-emeraldGreen shrink-0" />
                        <span>Distance: {dest.distance || '150 km'}</span>
                      </div>
                      {dest.estimatedFare > 0 && (
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400">Est. Taxi Fare</p>
                          <p className="font-bold text-emeraldGreen text-sm">Rs. {dest.estimatedFare}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleBookNow(dest.name)}
                    className="w-full btn-primary py-2.5 text-sm flex items-center justify-center space-x-2"
                  >
                    <span>Book Taxi to {dest.name.split(' ')[0]}</span>
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
