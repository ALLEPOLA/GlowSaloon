import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      {/* Decorative leaf elements */}
      <div className="absolute top-10 right-10 text-green-200 text-8xl opacity-20">🌿</div>
      <div className="absolute bottom-20 left-10 text-green-200 text-8xl opacity-20">🍃</div>
      
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌱</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">GlowVault</h1>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold rounded-lg transition hover:border-emerald-700"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20 relative">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-7xl animate-pulse">🌿</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Welcome to GlowVault
          </h2>
          <p className="text-2xl text-gray-700 mb-4 font-semibold">
            Eco-Friendly Salon Service Management
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in creating a sustainable beauty experience. Discover our premium, eco-conscious salon services designed for both your beauty and our planet's wellness.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-emerald-500 hover:border-emerald-600">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">♻️</div>
            <h3 className="text-2xl font-bold text-emerald-700 mb-3">Sustainable Practices</h3>
            <p className="text-gray-600 leading-relaxed">
              Eco-friendly products and waste-conscious services for a greener tomorrow
            </p>
          </div>

          <div className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-green-500 hover:border-green-600">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">💆</div>
            <h3 className="text-2xl font-bold text-green-700 mb-3">Premium Care</h3>
            <p className="text-gray-600 leading-relaxed">
              Professional haircut, styling, nail care, and relaxing massage treatments
            </p>
          </div>

          <div className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-teal-500 hover:border-teal-600">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">🌍</div>
            <h3 className="text-2xl font-bold text-teal-700 mb-3">Natural Ingredients</h3>
            <p className="text-gray-600 leading-relaxed">
              Organic and natural products that are safe for you and kind to nature
            </p>
          </div>
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-10 text-center relative">
                <div className="absolute top-3 right-6 text-white/20 text-6xl">🌱</div>
                <h3 className="text-3xl font-bold text-white mb-4">Start Your Green Journey</h3>
                <p className="text-lg text-emerald-50 mb-8">
                  Join our eco-conscious community and book your first sustainable beauty appointment today
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate('/register')}
                    className="px-10 py-4 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition shadow-lg text-lg"
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
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Our Eco-Friendly Salon?</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition">
              <span className="text-4xl">🌿</span>
              <div>
                <h4 className="font-bold text-emerald-700">100% Sustainable Products</h4>
                <p className="text-gray-600">All products are eco-certified and biodegradable</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition">
              <span className="text-4xl">♻️</span>
              <div>
                <h4 className="font-bold text-emerald-700">Zero-Waste Operations</h4>
                <p className="text-gray-600">We reduce, reuse, and recycle everything possible</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition">
              <span className="text-4xl">🌍</span>
              <div>
                <h4 className="font-bold text-emerald-700">Community Impact</h4>
                <p className="text-gray-600">A portion of proceeds goes to environmental initiatives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Portal Link */}
        <div className="mt-16 text-center border-t border-emerald-100 pt-8 max-w-4xl mx-auto">
          <p className="text-gray-500 mb-4">Are you a GlowVault team member?</p>
          <button
            onClick={() => navigate('/staff-login')}
            className="px-6 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold rounded-lg transition"
          >
            Staff Login Portal
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
