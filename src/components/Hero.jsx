import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import { MessageSquare, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 transition-colors duration-300">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out transform scale-105"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%), url('https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=1920')` 
        }}
      />

      {/* Decorative Floating Elements (Hills Motif) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-100 dark:from-darkBlue to-transparent z-10" />

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
        
        {/* Headquarter Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-emeraldGreen/20 backdrop-blur-md border border-emeraldGreen/30 text-emeraldGreen text-xs md:text-sm font-bold rounded-full mb-8"
        >
          <MapPin className="w-4 h-4" />
          <span>Headquarters: Ooty, Tamil Nadu</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight max-w-4xl mx-auto"
        >
          {t('heroTitle')}
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {t('heroSubtitle')}
        </motion.p>

        {/* Call to Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 px-4"
        >
          <Link to="/booking" className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
            <span>{t('bookNow')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <a 
            href="tel:+918778595023" 
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg font-semibold text-white transition-all duration-300 backdrop-blur-sm"
          >
            <Phone className="w-4 h-4" />
            <span>{t('callNow')}</span>
          </a>

          <a 
            href="https://wa.me/918778595023?text=Hello%20Ooty%20Travels%20Designer,%20I%20want%20to%20book%20a%20cab." 
            target="_blank" 
            rel="noreferrer"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] rounded-lg font-semibold text-white transition-all duration-300"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('whatsappUs')}</span>
          </a>
        </motion.div>

        {/* Small Trust Metrics */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center border-t border-white/10 pt-8"
        >
          <div>
            <p className="text-2xl md:text-3xl font-extrabold font-display text-emeraldGreen">25k+</p>
            <p className="text-[10px] md:text-xs uppercase text-slate-400 font-semibold tracking-wider mt-1">Happy Riders</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold font-display text-emeraldGreen">120+</p>
            <p className="text-[10px] md:text-xs uppercase text-slate-400 font-semibold tracking-wider mt-1">Luxury Fleet</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold font-display text-emeraldGreen">24/7</p>
            <p className="text-[10px] md:text-xs uppercase text-slate-400 font-semibold tracking-wider mt-1">Support Desk</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
