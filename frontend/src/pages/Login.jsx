import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { useTranslation } from '../context/LanguageContext';
import { Lock, Mail, HelpCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showHelper] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDemoFill = (role) => {
    if (role === 'Admin') {
      setForm({ email: 'admin@ootytravels.com', password: 'admin123' });
    } else if (role === 'Manager') {
      setForm({ email: 'manager@ootytravels.com', password: 'manager123' });
    } else if (role === 'Driver') {
      setForm({ email: 'ramesh@ootytravels.com', password: 'driver123' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;

    dispatch(loginStart());
    try {
      const response = await axios.post('/api/auth/login', form);
      if (response.data && response.data.success) {
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token
        }));
        
        // Redirect to admin panel or homepage
        if (response.data.user.role === 'Admin' || response.data.user.role === 'Manager') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.warn('Backend login route failed, using mock auth client-side', error);
      
      // Fallback auth mapping for offline mock test run
      let mockUser = null;
      if (form.email === 'admin@ootytravels.com' && form.password === 'admin123') {
        mockUser = { id: 'mock_adm', name: 'Ooty Travels Admin', email: 'admin@ootytravels.com', role: 'Admin' };
      } else if (form.email === 'manager@ootytravels.com' && form.password === 'manager123') {
        mockUser = { id: 'mock_mng', name: 'Operations Manager', email: 'manager@ootytravels.com', role: 'Manager' };
      } else if (form.email === 'ramesh@ootytravels.com' && form.password === 'driver123') {
        mockUser = { id: 'mock_drv', name: 'Ramesh Kumar', email: 'ramesh@ootytravels.com', role: 'Driver' };
      }

      if (mockUser) {
        dispatch(loginSuccess({
          user: mockUser,
          token: 'mock_jwt_token_string'
        }));
        if (mockUser.role === 'Admin' || mockUser.role === 'Manager') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        dispatch(loginFailure(error.response?.data?.message || 'Invalid credentials. Check demo accounts below.'));
      }
    }
  };

  return (
    <div className="bg-lightGray dark:bg-darkBlue min-h-[90vh] transition-colors duration-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background circles decoration */}
      <div className="absolute w-[400px] h-[400px] bg-emeraldGreen/5 dark:bg-emeraldGreen/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Glassmorphic Form Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <img
                src="/OOty.png"
                alt="Ooty Travels Designer Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
              Staff Console Login
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Ooty Travels Designer</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-emeraldGreen" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@ootytravels.com"
                className="form-input text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emeraldGreen" />
                <span>Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-sm font-semibold tracking-wide flex justify-center items-center mt-6"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Tester demo accounts panel */}
          {showHelper && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-750 rounded-2xl text-xs space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                <HelpCircle className="w-4 h-4 text-emeraldGreen" />
                <span>Demo Accounts (Click to Fill)</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleDemoFill('Admin')}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-850 hover:bg-emeraldGreen hover:text-white rounded font-medium text-[10px]"
                >
                  Admin Role
                </button>
                <button
                  onClick={() => handleDemoFill('Manager')}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-850 hover:bg-emeraldGreen hover:text-white rounded font-medium text-[10px]"
                >
                  Manager Role
                </button>
                <button
                  onClick={() => handleDemoFill('Driver')}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-850 hover:bg-emeraldGreen hover:text-white rounded font-medium text-[10px]"
                >
                  Driver Role
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Allows instant local dashboard access.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
