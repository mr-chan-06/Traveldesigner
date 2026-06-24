import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Mail, Phone, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darkBlue text-slate-300 pt-16 pb-8 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company Brief */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img
                src="/OOty.png"
                alt="Ooty Travels Designer Logo"
                className="h-14 w-auto object-contain drop-shadow-lg brightness-125"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium cab services, local hills packages, and airport transfers across Tamil Nadu, Kerala, and Karnataka. Experience safe travel with professional drivers.
            </p>
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://wa.me/918778595023" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-emeraldGreen/10 hover:bg-emeraldGreen text-emeraldGreen hover:text-white rounded-lg transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a 
                href="tel:+918778595023" 
                className="p-2 bg-emeraldGreen/10 hover:bg-emeraldGreen text-emeraldGreen hover:text-white rounded-lg transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-lg tracking-wide border-l-4 border-emeraldGreen pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-emeraldGreen transition-colors">{t('navAbout')}</Link></li>
              <li><Link to="/services" className="hover:text-emeraldGreen transition-colors">{t('navServices')}</Link></li>
              <li><Link to="/destinations" className="hover:text-emeraldGreen transition-colors">{t('navDestinations')}</Link></li>
              <li><Link to="/fleet" className="hover:text-emeraldGreen transition-colors">{t('navFleet')}</Link></li>
              <li><Link to="/packages" className="hover:text-emeraldGreen transition-colors">{t('navPackages')}</Link></li>
              <li><Link to="/booking" className="hover:text-emeraldGreen transition-colors">{t('navBooking')}</Link></li>
            </ul>
          </div>

          {/* Services Offered */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-lg tracking-wide border-l-4 border-emeraldGreen pl-3">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Local Hill Station Cabs</li>
              <li>Airport Pickup & Drop Transfers</li>
              <li>Outstation Round-Trips</li>
              <li>One-Way Drop Taxi</li>
              <li>Wedding Luxury Transportation</li>
              <li>Corporate Employee Rides</li>
            </ul>
          </div>

          {/* Headquarters Info */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-lg tracking-wide border-l-4 border-emeraldGreen pl-3">
              Contact Office
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-5 h-5 text-emeraldGreen shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  {t('address')}
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emeraldGreen" />
                <a href="tel:+918778595023" className="hover:text-emeraldGreen transition-colors">+91 87785 95023</a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emeraldGreen" />
                <a href="mailto:booking@ootytravels.com" className="hover:text-emeraldGreen transition-colors">booking@ootytravels.com</a>
              </li>
              <li className="flex items-center space-x-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emeraldGreen" />
                <span>GST Registered | Safe Travels ISO Certified</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} Ooty Travels Designer. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/login" className="hover:text-emeraldGreen">Admin Console</Link>
            <span>•</span>
            <span className="text-slate-600">Ooty Hill Station Tourism Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
