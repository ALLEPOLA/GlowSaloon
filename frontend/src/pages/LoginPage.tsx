import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 text-teal-800 text-8xl opacity-10 animate-pulse" style={{animationDuration: '4s'}}>🌿</div>
      <div className="absolute bottom-20 left-10 text-teal-800 text-8xl opacity-10 animate-pulse" style={{animationDuration: '5s'}}>🍃</div>
      <div className="absolute top-1/4 left-20 w-72 h-72 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-20 w-72 h-72 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10 transform transition-all duration-500 hover:scale-105">
        {/* Glassmorphism card with gradient border */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-teal-700 to-emerald-700 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
          
          <div className="relative bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-600/50">
            {/* Header Section with Animation */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-5xl animate-bounce" style={{animationDuration: '2s'}}>🌱</span>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">GlowVault</h1>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Welcome Back</h2>
              <p className="text-slate-400">Sign in to your eco-friendly beauty experience</p>
            </div>

            {/* Error Alert with Animation */}
            {error && (
              <div className="mb-6 p-4 bg-slate-900/50 border-l-4 border-red-500 text-red-400 rounded-xl animate-slide-down font-medium flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <span className="inline-block mr-1">📧</span>Email Address
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3 text-white placeholder-slate-500 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                      focusedField === 'email'
                        ? 'border-teal-500 shadow-lg shadow-teal-500/20 bg-slate-900/50'
                        : 'border-slate-600 hover:border-teal-400 bg-slate-700/50'
                    }`}
                    placeholder="your@email.com"
                  />
                  {focusedField === 'email' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500 animate-pulse">✓</div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <span className="inline-block mr-1">🔐</span>Password
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3 text-white placeholder-slate-500 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                      focusedField === 'password'
                        ? 'border-teal-500 shadow-lg shadow-teal-500/20 bg-slate-900/50'
                        : 'border-slate-600 hover:border-teal-400 bg-slate-700/50'
                    }`}
                    placeholder="••••••••"
                  />
                  {focusedField === 'password' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500 animate-pulse">✓</div>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-md cursor-pointer accent-teal-500 bg-slate-700 border-slate-600" />
                  <span className="text-slate-300 group-hover:text-teal-400 transition">Remember me</span>
                </label>
                <a href="#" className="text-teal-400 hover:text-teal-300 font-semibold transition hover:underline">
                  Forgot?
                </a>
              </div>

              {/* Submit Button with Animation */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white text-lg transition-all duration-500 transform ${
                  loading
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1 active:translate-y-0 active:shadow-lg'
                } flex items-center justify-center gap-2 shadow-lg`}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Authenticating...
                  </>
                ) : (
                  <>
               
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <span className="text-slate-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="py-2 px-3 border-2 border-slate-600 rounded-lg hover:border-teal-400 hover:bg-slate-700/50 transition duration-300 flex items-center justify-center gap-2 font-semibold text-slate-200">
                <span className="text-xl">🌍</span>Google
              </button>
              <button className="py-2 px-3 border-2 border-slate-600 rounded-lg hover:border-teal-400 hover:bg-slate-700/50 transition duration-300 flex items-center justify-center gap-2 font-semibold text-slate-200">
                <span className="text-xl">👤</span>Facebook
              </button>
            </div>

            {/* Register Link */}
            <p className="text-center text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-teal-400 hover:text-teal-300 font-bold transition hover:underline"
              >
                Create one now
              </button>
            </p>

            
          </div>
        </div>
      </div>

      {/* Add animations via style tag */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
