import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName = 'User' }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 text-white/20 text-9xl">🌿</div>
      <div className="relative">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-emerald-50 text-lg mb-6">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition shadow-lg">
          📅 Book Now
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
