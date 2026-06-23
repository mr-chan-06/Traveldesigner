import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { Menu, X, LayoutDashboard, LogIn, LogOut, Phone } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('navHome') },
    { to: '/about', label: t('navAbout') },
    { to: '/services', label: t('navServices') },
    { to: '/destinations', label: t('navDestinations') },
    { to: '/fleet', label: t('navFleet') },
    { to: '/packages', label: t('navPackages') },
    { to: '/contact', label: t('navContact') }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-nav shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/OOty.png"
                alt="Ooty Travels Designer Logo"
                className="h-12 w-auto object-contain drop-shadow-md"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-emeraldGreen'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emeraldGreen'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSelector />
            
            {/* Quick Call Button */}
            <a 
              href="tel:+918778595023" 
              className="flex items-center space-x-1.5 px-4 py-2 bg-emeraldGreen/10 text-emeraldGreen border border-emeraldGreen/20 hover:bg-emeraldGreen hover:text-white rounded-lg text-sm font-semibold transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </a>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-700">
                {(user.role === 'Admin' || user.role === 'Manager') && (
                  <Link
                    to="/admin"
                    className="p-2 text-slate-500 hover:text-emeraldGreen dark:text-slate-400 transition-colors"
                    title={t('navDashboard')}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                  title={t('navLogout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-emeraldGreen dark:hover:text-emeraldGreen text-sm font-semibold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('navLogin')}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-3">
            <ThemeToggle />
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card absolute w-full top-20 border-b border-slate-200/50 dark:border-slate-800/50 p-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-emeraldGreen/10 text-emeraldGreen'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-emeraldGreen'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex flex-col space-y-3">
            <a 
              href="tel:+918778595023" 
              className="flex items-center justify-center space-x-1.5 w-full py-3 bg-emeraldGreen text-white rounded-lg text-base font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Call +91 98765 43210</span>
            </a>

            {isAuthenticated ? (
              <div className="flex justify-between items-center px-3 pt-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                  <span className="text-xs text-slate-400">{user.role}</span>
                </div>
                <div className="flex space-x-3">
                  {(user.role === 'Admin' || user.role === 'Manager') && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-1.5 w-full py-3 border-2 border-emeraldGreen text-emeraldGreen font-semibold rounded-lg"
              >
                <LogIn className="w-5 h-5" />
                <span>{t('navLogin')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
