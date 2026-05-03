import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StaffLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { staffLogin } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const user = await staffLogin(loginData.email, loginData.password);
      if (user && user.roleId === 1) {
        navigate('/admin-dashboard');
      } else {
        navigate('/staff-dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Staff Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Name, email, and password are required');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/staff-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          phone: registerData.phone || undefined,
          specialization: registerData.specialization || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setRegisteredEmail(registerData.email);
      setShowVerificationPopup(true);
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        specialization: '',
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 text-teal-800 text-8xl opacity-10 animate-pulse" style={{animationDuration: '4s'}}>🛡️</div>
      <div className="absolute bottom-20 left-10 text-teal-800 text-8xl opacity-10 animate-pulse" style={{animationDuration: '5s'}}>💼</div>
      <div className="absolute top-1/4 left-20 w-72 h-72 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-20 w-72 h-72 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>

      {/* VERIFICATION POPUP MODAL */}
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-bounce-in">
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-4xl">
                ⏳
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Awaiting Admin Verification</h2>
              <p className="text-gray-600 text-sm mb-4">
                Thank you for registering! Your application has been submitted successfully.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800">
                  <strong>Email:</strong> {registeredEmail}
                </p>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                An administrator will review your registration and approve your account shortly. You'll be able to log in once approved.
              </p>
            </div>
            <button
              onClick={() => {
                setShowVerificationPopup(false);
                setIsRegistering(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-500 hover:to-emerald-500 transition"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-md relative z-10 transform transition-all duration-500 hover:scale-105">
        {/* Glassmorphism card with gradient border */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-teal-700 to-emerald-700 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
          
          <div className="relative bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-600/50 max-h-[90vh] overflow-y-auto">
            {/* Header Section with Animation */}
            <div className="text-center mb-6 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-5xl animate-pulse text-teal-400" style={{animationDuration: '3s'}}>🏢</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">GlowVault Staff</h1>
              <p className="text-slate-400">{isRegistering ? 'Join our team' : 'Secure access to the staff portal'}</p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-bold transition ${
                  !isRegistering
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-bold transition ${
                  isRegistering
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Alert with Animation */}
            {error && (
              <div className="mb-6 p-4 bg-slate-900/50 border-l-4 border-red-500 text-red-400 rounded-lg animate-slide-down font-medium flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                {error}
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-6 p-4 bg-slate-900/50 border-l-4 border-emerald-500 text-emerald-400 rounded-lg animate-slide-down font-medium flex items-center gap-2">
                <span className="text-xl">✅</span>
                {success}
              </div>
            )}

            {/* LOGIN FORM */}
            {!isRegistering && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    <span className="inline-block mr-1">📧</span>Employee Email
                  </label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 py-3 text-white placeholder-slate-500 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        focusedField === 'email'
                          ? 'border-teal-500 shadow-lg shadow-teal-500/20 bg-slate-900/50'
                          : 'border-slate-600 hover:border-teal-400 bg-slate-700/50'
                      }`}
                      placeholder="staff@glowvault.com"
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
                      value={loginData.password}
                      onChange={handleLoginChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 py-3 text-white placeholder-slate-500 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        focusedField === 'password'
                          ? 'border-teal-500 shadow-lg shadow-teal-500/20 bg-slate-900/50'
                          : 'border-slate-600 hover:border-teal-400 bg-slate-700/50'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm mt-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded-md cursor-pointer accent-teal-500 bg-slate-700 border-slate-600" />
                    <span className="text-slate-300 group-hover:text-teal-400 transition">Keep me signed in</span>
                  </label>
                  <a href="#" className="text-teal-400 hover:text-teal-300 font-semibold transition hover:underline">
                    IT Support
                  </a>
                </div>

                {/* Submit Button with Animation */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-white text-lg transition-all duration-500 transform ${
                    loading
                      ? 'bg-slate-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1 active:translate-y-0 active:shadow-lg mt-6'
                  } flex items-center justify-center gap-2 shadow-lg`}
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                    
                      Access Portal
                    </>
                  )}
                </button>

              </form>
            )}

            {/* REGISTRATION FORM */}
            {isRegistering && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    <span className="inline-block mr-1">👤</span>Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-2 text-white placeholder-slate-500 border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                      focusedField === 'name'
                        ? 'border-teal-500 shadow-lg shadow-teal-500/20 bg-slate-900/50'
                        : 'border-slate-600 hover:border-teal-400 bg-slate-700/50'
                    }`}
                    placeholder=""
                  />
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    <span className="inline-block mr-1">📧</span>Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    onFocus={() => setFocusedField('reg-email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-2 text-white placeholder-slate-500 border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                      focusedField === 'reg-email'
                        ? 'border-teal-500 shadow-lg shadow-teal-500/20 bg-slate-900/50'
                        : 'border-slate-600 hover:border-teal-400 bg-slate-700/50'
                    }`}
                    placeholder="john@glowvault.com"
                  />
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    <span className="inline-block mr-1">🔐</span>Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 text-white placeholder-slate-500 border-2 border-slate-600 hover:border-teal-400 bg-slate-700/50 rounded-lg transition-all duration-300 focus:outline-none focus:border-teal-500"
                    placeholder="••••••••"
                  />
                </div>

                {/* Confirm Password */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    <span className="inline-block mr-1">🔐</span>Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 text-white placeholder-slate-500 border-2 border-slate-600 hover:border-teal-400 bg-slate-700/50 rounded-lg transition-all duration-300 focus:outline-none focus:border-teal-500"
                    placeholder="••••••••"
                  />
                </div>

                {/* Phone Field */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    <span className="inline-block mr-1">📱</span>Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 text-white placeholder-slate-500 border-2 border-slate-600 hover:border-teal-400 bg-slate-700/50 rounded-lg transition-all duration-300 focus:outline-none focus:border-teal-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Specialization */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    <span className="inline-block mr-1">✨</span>Specialization (Optional)
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={registerData.specialization}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 text-white placeholder-slate-500 border-2 border-slate-600 hover:border-teal-400 bg-slate-700/50 rounded-lg transition-all duration-300 focus:outline-none focus:border-teal-500"
                    placeholder="Master Stylist, Massage Therapist, etc."
                  />
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-white text-lg transition-all duration-500 transform ${
                    loading
                      ? 'bg-slate-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1 active:translate-y-0 active:shadow-lg mt-4'
                  } flex items-center justify-center gap-2 shadow-lg`}
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      Registering...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Register & Submit
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center border-t border-slate-700 pt-4">
              <button
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-slate-200 transition text-sm font-medium"
              >
                ← Return to main site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add animations via style tag */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.4s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
      `}</style>
      </div>
    </>
  );
};

export default StaffLoginPage;
