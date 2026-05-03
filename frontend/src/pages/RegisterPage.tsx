import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, googleSignUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Other',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
      });

      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setLoading(true);

    try {
      await googleSignUp(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign up failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="27562406372-k7sngkl7fusptqsu6g4tm0tb2a95crtm.apps.googleusercontent.com">
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-10 right-10 text-teal-800 text-6xl opacity-20 animate-pulse">🌿</div>
        <div className="absolute bottom-20 left-10 text-teal-800 text-6xl opacity-20 animate-pulse">🍃</div>
        <div className="absolute top-1/4 left-20 w-72 h-72 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 right-20 w-72 h-72 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        
        <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-slate-600/50 max-h-[90vh] overflow-y-auto">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 text-center">Create Account</h2>

          {error && (
            <div className="mb-4 p-4 bg-slate-900/50 border-l-4 border-red-500 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              >
                <option value="Other">Other</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="123 Main St, City, State"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition disabled:bg-slate-600 shadow-md"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          {/* Google Sign-Up Button */}
          <div className="mb-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
            />
          </div>

          <p className="text-center text-slate-400 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-teal-400 hover:text-teal-300 font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterPage;
