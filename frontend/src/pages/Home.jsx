import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import Hero from '../components/Hero';
import BookingForm from '../components/BookingForm';
import { Star, ShieldCheck, Compass, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const { t } = useTranslation();

  const [popularDests, setPopularDests] = useState([]);
  const [destsLoading, setDestsLoading] = useState(true);

  // Fallback destinations if API unavailable
  const fallbackDests = [
    { _id: 'dest_1', name: 'Ooty Hills', state: 'Tamil Nadu', estimatedFare: 2200, image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600' },
    { _id: 'dest_2', name: 'Munnar Tea Trails', state: 'Kerala', estimatedFare: 4200, image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600' },
    { _id: 'dest_3', name: 'Coorg Valleys', state: 'Karnataka', estimatedFare: 5500, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=600' }
  ];

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const response = await axios.get('/api/destinations');
        if (response.data && response.data.success && response.data.data.length > 0) {
          // Show only the first 3 destinations from DB on the home page
          setPopularDests(response.data.data.slice(0, 3));
        } else {
          setPopularDests(fallbackDests);
        }
      } catch (error) {
        console.error('Failed to fetch destinations for home page, using fallbacks.', error);
        setPopularDests(fallbackDests);
      } finally {
        setDestsLoading(false);
      }
    };
    fetchPopularDestinations();
  }, []);

  const services = [
    { title: 'Hill Station Packages', desc: 'Expert navigations up Ooty, Kodai & Munnar hairpin bends.', icon: Compass },
    { title: 'Airport Transfers', desc: 'Timely pick/drop to Coimbatore, Bangalore & Kochi airports.', icon: ShieldCheck },
    { title: 'Outstation Travel', desc: 'Inter-state trips across Tamil Nadu, Kerala, and Karnataka.', icon: HeartHandshake }
  ];

  const fleet = [
    { name: 'Toyota Innova Crysta', cap: '7 Seats', rate: 'Rs. 22/km', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600' },
    { name: 'Maruti Suzuki Dzire', cap: '4 Seats', rate: 'Rs. 14/km', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600' }
  ];

  const testimonials = [
    { name: 'Aditya Menon', city: 'Kochi', quote: 'Excellent service! Driver was extremely safe and experienced with Ooty steep roads. Highly recommend Innova Crysta booking.', rating: 5 },
    { name: 'Priya Sundar', city: 'Chennai', quote: 'Booked a one-way trip from Coimbatore airport to Ooty. Seamless booking online and driver was waiting before we landed.', rating: 5 }
  ];

  return (
    <div className="bg-lightGray dark:bg-darkBlue min-h-screen transition-colors duration-300 pb-16">
      <Hero />
      <BookingForm />

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white">
            Premium Travels Designed For You
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Experience comfortable, safe and memorable inter-state travel with our customized hill cabs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 space-y-4"
              >
                <div className="p-3.5 bg-emeraldGreen/10 text-emeraldGreen inline-block rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{srv.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{srv.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 mt-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white">
              {t('whyChooseUs')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              We specialize in travel across Tamil Nadu, Kerala, and Karnataka. Operating out of Ooty, our local experts understand routes, tolls, and safety standards like no other.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                'Local Ooty Hill Experts',
                '24/7 Dispatch Center',
                'Transparent Per-KM Fares',
                'Verified Luxury Vehicles',
                'Clean AC/Non-AC Options',
                'Safe English/Tamil/Malayalam Drivers'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emeraldGreen shrink-0" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link to="/about" className="btn-primary inline-flex items-center space-x-2">
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" 
              alt="Luxury Cab Travels" 
              className="rounded-2xl shadow-2xl w-full object-cover h-[450px]"
            />
            <div className="absolute -bottom-6 -left-6 bg-emeraldGreen text-white p-6 rounded-2xl shadow-xl hidden sm:block">
              <p className="text-3xl font-extrabold font-display">10+</p>
              <p className="text-xs uppercase tracking-wider font-semibold mt-1">Years Travel Expertise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-5">
          <div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
              {t('popularDest')}
            </h2>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400">Handpicked popular tour destination rides.</p>
          </div>
          <Link to="/destinations" className="text-emeraldGreen hover:text-emerald-600 font-semibold text-sm flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {destsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700 animate-pulse">
                <div className="h-56 bg-slate-200 dark:bg-slate-700" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {popularDests.map((dest) => (
              <div key={dest._id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md group border border-slate-100 dark:border-slate-700">
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                    {dest.state}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{dest.name}</h3>
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-xs text-slate-400">Est. Starting Fare</p>
                      <p className="text-lg font-bold text-emeraldGreen">
                        {dest.estimatedFare > 0 ? `Rs. ${dest.estimatedFare}` : 'Contact Us'}
                      </p>
                    </div>
                    <Link to="/booking" className="px-4 py-2 bg-emeraldGreen text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors">
                      Book Ride
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fleet Showcase */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 mt-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
              {t('featuredFleet')}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Choose from Hatchbacks, luxury SUVs, to Innova Crystas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            {fleet.map((car, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col sm:flex-row border border-slate-100 dark:border-slate-700">
                <img src={car.img} alt={car.name} className="w-full sm:w-48 h-48 object-cover" />
                <div className="p-6 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{car.name}</h3>
                    <p className="text-xs text-slate-400">Capacity: {car.cap} | AC standard</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400">Pricing starts at</p>
                      <p className="text-base font-bold text-emeraldGreen">{car.rate}</p>
                    </div>
                    <Link to="/fleet" className="text-xs font-bold text-emeraldGreen hover:underline">
                      View details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center">
          <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            {t('testimonials')}
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">What our travel customers say about us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 space-y-4">
              <div className="flex text-amber-500">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 italic">"{test.quote}"</p>
              <div className="pt-2">
                <p className="font-bold text-slate-900 dark:text-white">{test.name}</p>
                <p className="text-xs text-slate-450">{test.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
