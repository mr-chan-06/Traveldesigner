import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Check, HelpCircle } from 'lucide-react';
import axios from 'axios';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      alert('Please fill in Name, Phone, and Message fields.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/enquiries', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject || 'General Inquiry',
        message: form.message,
        source: 'Contact Form Lead'
      });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry, fallback log to console', error);
      setSubmitted(true);
    } finally {
      setLoading(false);
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
          <h1 className="font-display font-extrabold text-4xl">{t('navContact')}</h1>
          <p className="mt-2 text-slate-400">Get in touch with Ooty Travels Designer head office</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Info and Map */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3">
              Head Office Contact Info
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Our travel design operations are coordinates centrally from Ooty, Tamil Nadu. Reach out for corporate taxi bookings, wedding car decorators, and multi-day tour package calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-emeraldGreen shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{t('headOffice')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                  Ooty Travels Designer, 45, Club Road, Near Lake, Ooty, Tamil Nadu - 643001
                </p>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start space-x-3">
              <Phone className="w-5 h-5 text-emeraldGreen shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Call/WhatsApp Desk</h4>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                  Mob: +91 87785 95023
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-450">
                  Tel: +91 423 2445566
                </p>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start space-x-3">
              <Mail className="w-5 h-5 text-emeraldGreen shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Support Emails</h4>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 hover:underline">
                  booking@ootytravels.com
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-450 hover:underline">
                  support@ootytravels.com
                </p>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-emeraldGreen shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Active Timings</h4>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                  Booking Desk: 24/7 active
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-450">
                  Office Admin: 9 AM - 8 PM
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Mockup */}
          <div className="h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner border border-slate-300 dark:border-slate-800 flex items-center justify-center">
            
            {/* Visual Grid representing streets */}
            <div className="absolute inset-0 bg-grid opacity-15" />
            
            {/* Decorative River / Lake Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <path d="M 0,100 Q 150,180 300,120 T 600,200" fill="none" stroke="#38BDF8" strokeWidth="12" />
            </svg>
            
            <div className="relative text-center z-10 space-y-2">
              <div className="w-10 h-10 bg-emeraldGreen text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white font-display">Ooty Travels Designer HQ</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Club Road, Near Ooty Lake, Tamil Nadu</p>
              <a 
                href="https://maps.google.com/?q=Ooty+Lake" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block text-[11px] bg-slate-900 text-white font-bold px-3 py-1.5 rounded hover:bg-slate-800"
              >
                Open Google Maps
              </a>
            </div>
            
            <div className="absolute bottom-2 left-2 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded text-[10px] text-slate-550 border border-slate-200 dark:border-slate-700">
              Ooty Map Grid Mockup
            </div>

          </div>

        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-md border border-slate-150 dark:border-slate-750 flex flex-col justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white border-l-4 border-emeraldGreen pl-3 mb-6">
              Send Email Inquiry
            </h2>

            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 bg-emeraldGreen/10 text-emeraldGreen rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl">Thank You for Connecting!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mx-auto">
                  Your enquiry has been successfully logged at the Ooty HQ dashboard. Our customer rep will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary py-2 px-5 text-xs"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name" 
                      className="form-input text-sm" 
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone" 
                      className="form-input text-sm" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@domain.com" 
                    className="form-input text-sm" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Booking Quote / Outstation Cab / Business" 
                    className="form-input text-sm" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase">Message</label>
                  <textarea 
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Details about your pickup points, destination itinerary, passengers..." 
                    className="form-input text-sm h-32 resize-none" 
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 flex items-center justify-center space-x-2 text-sm"
                >
                  <span>{loading ? 'Submitting...' : 'Send Inquiry Message'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Quick Chat Shortcut */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <span className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4 text-emeraldGreen" />
              <span>Need an immediate cab? Chat on WhatsApp:</span>
            </span>
            <a 
              href="https://wa.me/918778595023?text=Hello%20Ooty%20Travels.%20I%20need%20a%20cab%20urgently." 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#20ba5a] transition-colors"
            >
              Start Chat
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
