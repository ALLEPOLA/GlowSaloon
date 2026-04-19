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
      className={`fixed md:relative left-0 top-16 md:top-0 h-[calc(100vh-64px)] md:h-auto bg-white shadow-lg transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-64'
      } overflow-y-auto border-r border-emerald-100`}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as TabType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition mt-6 border-t pt-6"
        >
          <span className="text-xl">🚪</span>
          <span className="font-semibold">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
