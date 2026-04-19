import React, { useState, useEffect } from 'react';

interface AdminWelcomeSectionProps {
  userName?: string;
}

const AdminWelcomeSection: React.FC<AdminWelcomeSectionProps> = ({ userName = 'Admin' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  const currentTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative overflow-hidden border border-slate-700/60">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">
            {getGreeting()}, <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">{userName}</span>! 🚀
          </h2>
          <div className="flex items-center gap-3 text-slate-400 font-medium">
            <span className="flex items-center gap-1">📅 {currentDate}</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-teal-300 font-bold">🕒 {currentTime}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex justify-center items-center gap-2 px-5 py-2.5 bg-slate-900/40 hover:bg-slate-900/60 text-teal-200 font-bold rounded-xl transition shadow-sm border border-slate-700">
            <span>🧑‍💼</span> Add Staff
          </button>
          <button className="flex justify-center items-center gap-2 px-5 py-2.5 bg-slate-900/40 hover:bg-slate-900/60 text-teal-200 font-bold rounded-xl transition shadow-sm border border-slate-700">
            <span>✨</span> Add Service
          </button>
          <button className="flex justify-center items-center gap-2 px-5 py-2.5 bg-slate-900/40 hover:bg-slate-900/60 text-teal-200 font-bold rounded-xl transition shadow-sm border border-slate-700">
            <span>📈</span> View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcomeSection;
