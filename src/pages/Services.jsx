import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  Car, Map, ShieldAlert, Award, CalendarDays, Building, 
  Heart, Trees, Plane, Users 
} from 'lucide-react';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    { title: 'Local City Rides', desc: 'Quick on-demand local cabs in Ooty, Coonoor, Mysore, or Munnar.', icon: Car },
    { title: 'Airport Transfers', desc: 'Direct airport cabs to/from Coimbatore (CJB), Bangalore (BLR), and Kochi (COK).', icon: Plane },
    { title: 'Outstation Trips', desc: 'Interstate cabs connecting Tamil Nadu, Kerala, and Karnataka.', icon: Map },
    { title: 'One-Way Taxi', desc: 'Pay only for one-way drops on popular travel routes.', icon: ShieldAlert },
    { title: 'Round Trip Taxi', desc: 'Discounted multi-day round trip cabs with driver allowance included.', icon: Award },
    { title: 'Corporate Travel', desc: 'Monthly car rentals and transport management solutions for business firms.', icon: Building },
    { title: 'Wedding Transportation', desc: 'Premium luxury vehicles decorated for couples and guest transport.', icon: Heart },
    { title: 'Holiday Tour Packages', desc: 'Complete sightseeing schedules covering the best scenic paths.', icon: CalendarDays },
    { title: 'Hill Station Packages', desc: 'Experienced drivers specializing in steep hair-pin curve navigation.', icon: Trees },
    { title: 'Group Travel Services', desc: 'Tempo Travellers and large vans for families and corporate teams.', icon: Users }
  ];

  return (
    <div className="bg-lightGray dark:bg-darkBlue min-h-screen transition-colors duration-300 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800')` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display font-extrabold text-4xl">{t('navServices')}</h1>
          <p className="mt-2 text-slate-400">Premium cab travel services tailored to your demands</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="p-3.5 bg-emeraldGreen/10 text-emeraldGreen inline-block rounded-xl group-hover:bg-emeraldGreen group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{srv.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{srv.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700">
                  <Link 
                    to="/booking" 
                    className="text-sm font-semibold text-emeraldGreen hover:text-emerald-600 inline-flex items-center space-x-1"
                  >
                    <span>Book Service</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
