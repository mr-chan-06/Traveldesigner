import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import { MapPin, Trophy, Target, Shield, Compass, Landmark } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  const achievements = [
    { title: '25,000+ Completed Trips', desc: 'Safely transported travelers across hills and plains.', icon: Trophy },
    { title: '120+ Fleet Network', desc: 'Pre-screened, fully insured, luxury tourism vehicles.', icon: Shield },
    { title: '100% Hill-Trained Drivers', desc: 'Expert navigators for Ooty and Munnar hairpin bends.', icon: Compass }
  ];

  const coverageLocations = [
    { name: 'Ooty (Head Office)', state: 'Tamil Nadu', role: 'Headquarters', x: '50%', y: '50%', main: true },
    { name: 'Coimbatore', state: 'Tamil Nadu', role: 'Airport Hub', x: '55%', y: '65%' },
    { name: 'Bangalore', state: 'Karnataka', role: 'Inter-State Link', x: '52%', y: '20%' },
    { name: 'Munnar', state: 'Kerala', role: 'Tourist Hub', x: '45%', y: '75%' },
    { name: 'Mysore', state: 'Karnataka', role: 'Tourist Hub', x: '42%', y: '35%' },
    { name: 'Kochi', state: 'Kerala', role: 'Airport Hub', x: '35%', y: '80%' }
  ];

  return (
    <div className="bg-lightGray dark:bg-darkBlue min-h-screen transition-colors duration-300 pb-20">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-16 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800')` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display font-extrabold text-4xl">{t('navAbout')}</h1>
          <p className="mt-2 text-slate-400">Headquartered in Ooty, Serving South India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* Intro Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
              Ooty Travels Designer
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              Founded in the misty hills of Ooty, Tamil Nadu, Ooty Travels Designer has grown to become the premier cab booking and tourism operator in South India. We provide seamless, premium rides connecting customers across Tamil Nadu, Kerala, and Karnataka.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              With a modern vehicle fleet, state-of-the-art dispatch software, and local drivers who speak multiple languages (English, Tamil, Malayalam, Kannada), we guarantee a comfortable and safe hill station journey.
            </p>
            <div className="flex items-center space-x-3 p-4 bg-emeraldGreen/10 border border-emeraldGreen/20 rounded-xl max-w-md">
              <MapPin className="w-6 h-6 text-emeraldGreen shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Registered Head Office</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">45, Club Road, Near Lake, Ooty, Tamil Nadu - 643001</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800" 
              alt="Ooty Nilgiri Hills" 
              className="rounded-2xl shadow-xl w-full object-cover h-[380px]"
            />
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="p-3 bg-emeraldGreen/10 text-emeraldGreen inline-block rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Our Mission</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
              To deliver premium, transparent, and custom cab rental experiences across South India hill stations, assuring safety, customer delight, and absolute visual comfort along scenic routes.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="p-3 bg-emeraldGreen/10 text-emeraldGreen inline-block rounded-lg">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Our Vision</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
              To be recognized as the leading sustainable travel and tour operator in South India, continuously innovating on-demand dispatch operations and fleet eco-standards from our Ooty base.
            </p>
          </div>
        </section>

        {/* Achievements list */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
              {t('companyAchievements')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Milestones that drive our dedication every single day.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((ach, idx) => {
              const Icon = ach.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start space-x-4">
                  <div className="p-3 bg-emeraldGreen/10 text-emeraldGreen rounded-xl">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">{ach.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive Coverage Map View */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-750">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            <div className="space-y-6 lg:col-span-1">
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-slate-900 dark:text-white leading-tight">
                Our Service Coverage Map
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Headquartered in Ooty, Tamil Nadu, we provide pick-up, drop-off, and round-trip cab networks connecting three primary states: Tamil Nadu, Kerala, and Karnataka.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <div className="w-3.5 h-3.5 rounded-full bg-emeraldGreen animate-ping" />
                  <span>Ooty Head Office (Control Center)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-350">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span>Coimbatore, Bangalore, Kochi Hubs</span>
                </div>
              </div>
            </div>

            {/* Glowing Map Representation */}
            <div className="lg:col-span-2 relative h-[380px] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              
              {/* Outer boundary circles representing states */}
              <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-dashed border-emeraldGreen/10 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-emeraldGreen/20 animate-spin" style={{ animationDuration: '15s' }} />
              
              {/* Glow lines back to HQ */}
              {coverageLocations.map((loc, idx) => {
                if (loc.main) return null;
                return (
                  <svg key={`line-${idx}`} className="absolute inset-0 w-full h-full pointer-events-none">
                    <line 
                      x1={loc.x} 
                      y1={loc.y} 
                      x2="50%" 
                      y2="50%" 
                      stroke="#10B981" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                      className="opacity-40"
                    />
                  </svg>
                );
              })}

              {/* Location Marker Dots */}
              {coverageLocations.map((loc, idx) => (
                <div 
                  key={idx}
                  className="absolute"
                  style={{ left: loc.x, top: loc.y, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative group cursor-pointer">
                    <div className={`rounded-full shadow-lg ${
                      loc.main 
                        ? 'w-6 h-6 bg-emeraldGreen text-white flex items-center justify-center animate-pulse' 
                        : 'w-4 h-4 bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-slate-900'
                    }`}>
                      {loc.main && <MapPin className="w-3.5 h-3.5" />}
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap opacity-100 group-hover:scale-100 transition-transform pointer-events-none font-bold">
                      {loc.name} ({loc.role})
                    </div>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 left-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                States covered: TN, KL, KA
              </div>

            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
