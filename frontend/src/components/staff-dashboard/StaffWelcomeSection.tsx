import React from 'react';

interface StaffWelcomeSectionProps {
  userName?: string;
}

const StaffWelcomeSection: React.FC<StaffWelcomeSectionProps> = ({ userName = 'Staff Member' }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative overflow-hidden border border-slate-700/60">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">
            {getGreeting()}, <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">{userName}</span>! 👋
          </h2>
          <p className="text-slate-400 text-lg">{currentDate}</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 px-6 py-4 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm text-slate-400 font-semibold mb-1">Current Status</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></span>
              <span className="text-teal-300 font-bold">Available (On Shift)</span>
            </div>
          </div>
          <button className="ml-4 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 rounded-lg text-sm transition font-medium">
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffWelcomeSection;
