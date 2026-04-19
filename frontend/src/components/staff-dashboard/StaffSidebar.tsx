import React from 'react';

type TabType = 'dashboard' | 'appointments' | 'services' | 'leaves' | 'profile' | 'reviews' | 'notifications';

interface StaffSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  sidebarOpen: boolean;
  onLogout: () => void;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ activeTab, onTabChange, sidebarOpen, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'appointments', label: 'My Appointments', icon: '📅' },
    { id: 'services', label: 'My Services', icon: '✂️' },
    { id: 'leaves', label: 'My Leaves', icon: '🌴' },
    { id: 'reviews', label: 'My Reviews', icon: '⭐' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <aside
      className={`fixed md:relative left-0 top-20 md:top-0 h-[calc(100vh-80px)] md:h-auto bg-slate-900/80 backdrop-blur-xl shadow-xl transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-64'
      } overflow-y-auto border-r border-slate-700/60 flex flex-col`}
    >
      <nav className="p-4 space-y-2 flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as TabType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-700/60">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-100 hover:bg-slate-800 transition"
        >
          <span className="text-xl">🚪</span>
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
