import React from 'react';

type TabType = 'dashboard' | 'appointments' | 'services' | 'profile' | 'reviews' | 'notifications';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  sidebarOpen: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, sidebarOpen, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'appointments', label: 'My Appointments', icon: '📅' },
    { id: 'services', label: 'Browse Services', icon: '✨' },
    { id: 'reviews', label: 'My Reviews', icon: '⭐' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <aside
      className={`fixed md:relative left-0 top-16 md:top-0 h-[calc(100vh-64px)] md:h-auto bg-slate-900/95 backdrop-blur-md shadow-xl transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-64'
      } overflow-y-auto border-r border-slate-700/70`}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as TabType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-800 hover:text-teal-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-amber-200 hover:bg-slate-800 hover:text-amber-100 transition mt-6 border-t border-slate-700 pt-6"
        >
          <span className="text-xl">🚪</span>
          <span className="font-semibold">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
