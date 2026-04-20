import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute top-24 left-10 w-72 h-72 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      <div className="pointer-events-none absolute bottom-24 right-10 w-72 h-72 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      <div className="pointer-events-none absolute top-16 right-16 text-teal-500/20 text-8xl animate-pulse" style={{ animationDuration: '4s' }}>🌿</div>
      <div className="pointer-events-none absolute bottom-16 left-12 text-emerald-500/20 text-8xl animate-pulse" style={{ animationDuration: '5s' }}>🍃</div>

      <header className="sticky top-0 z-50 border-b border-slate-700/70 bg-slate-900/85 backdrop-blur-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-pulse" style={{ animationDuration: '3s' }}>🌱</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">GlowVault</h1>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 border border-slate-600 text-teal-300 hover:bg-slate-800 font-semibold rounded-lg transition-all duration-300 hover:border-teal-500"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <span className="text-7xl animate-pulse" style={{ animationDuration: '3s' }}>🌿</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent mb-6">
            Welcome to GlowVault
          </h2>
          <p className="text-2xl text-slate-200 mb-4 font-semibold">
            Eco-Friendly Salon Service Management
          </p>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Join us in creating a sustainable beauty experience. Discover our premium, eco-conscious salon services designed for both your beauty and our planet's wellness.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group p-8 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60 hover:border-teal-500/40 transition duration-300 hover:-translate-y-1">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">♻️</div>
            <h3 className="text-2xl font-bold text-teal-300 mb-3">Sustainable Practices</h3>
            <p className="text-slate-300 leading-relaxed">
              Eco-friendly products and waste-conscious services for a greener tomorrow
            </p>
          </div>

          <div className="group p-8 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60 hover:border-emerald-500/40 transition duration-300 hover:-translate-y-1">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">💆</div>
            <h3 className="text-2xl font-bold text-emerald-300 mb-3">Premium Care</h3>
            <p className="text-slate-300 leading-relaxed">
              Professional haircut, styling, nail care, and relaxing massage treatments
            </p>
          </div>

          <div className="group p-8 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60 hover:border-teal-500/40 transition duration-300 hover:-translate-y-1">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">🌍</div>
            <h3 className="text-2xl font-bold text-teal-300 mb-3">Natural Ingredients</h3>
            <p className="text-slate-300 leading-relaxed">
              Organic and natural products that are safe for you and kind to nature
            </p>
          </div>
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-teal-700/90 to-emerald-700/90 border border-slate-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-10 text-center relative">
                <div className="absolute top-3 right-6 text-white/20 text-6xl">🌱</div>
                <h3 className="text-3xl font-bold text-white mb-4">Start Your Green Journey</h3>
                <p className="text-lg text-slate-100 mb-8">
                  Join our eco-conscious community and book your first sustainable beauty appointment today
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate('/register')}
                    className="px-10 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-slate-100 transition shadow-lg text-lg"
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-10 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/20 transition text-lg"
                  >
                    Already a Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-100 mb-12">Why Choose Our Eco-Friendly Salon?</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-800/95 border border-slate-700/60 rounded-lg shadow hover:shadow-md transition">
              <span className="text-4xl">🌿</span>
              <div>
                <h4 className="font-bold text-emerald-300">100% Sustainable Products</h4>
                <p className="text-slate-400">All products are eco-certified and biodegradable</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-800/95 border border-slate-700/60 rounded-lg shadow hover:shadow-md transition">
              <span className="text-4xl">♻️</span>
              <div>
                <h4 className="font-bold text-emerald-300">Zero-Waste Operations</h4>
                <p className="text-slate-400">We reduce, reuse, and recycle everything possible</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-800/95 border border-slate-700/60 rounded-lg shadow hover:shadow-md transition">
              <span className="text-4xl">🌍</span>
              <div>
                <h4 className="font-bold text-emerald-300">Community Impact</h4>
                <p className="text-slate-400">A portion of proceeds goes to environmental initiatives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Portal Link */}
        <div className="mt-16 text-center border-t border-slate-700 pt-8 max-w-4xl mx-auto">
          <p className="text-slate-400 mb-4">Are you a GlowVault team member?</p>
          <button
            onClick={() => navigate('/staff-login')}
            className="px-6 py-2 border border-slate-600 text-teal-300 hover:bg-slate-800 hover:border-teal-500 font-semibold rounded-lg transition-all duration-300"
          >
            Staff Login Portal
          </button>
        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default HomePage;
