import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName = 'User' }) => {
  return (
    <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-600/50">
      <div className="absolute top-0 right-0 text-white/20 text-9xl">🌿</div>
      <div className="relative">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! </h1>
        <p className="text-slate-100 text-lg mb-6">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <button className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition shadow-lg">
          📅 Book Now
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
