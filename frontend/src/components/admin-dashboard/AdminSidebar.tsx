import React from 'react';

type AdminTabType = 'dashboard' | 'customers' | 'staff' | 'services' | 'appointments' | 'categories' | 'reviews' | 'payments' | 'settings' | 'notifications';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
  sidebarOpen: boolean;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange, sidebarOpen, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'customers', label: 'Manage Customers', icon: '👥' },
    { id: 'staff', label: 'Manage Staff', icon: '🧑‍💼' },
    { id: 'services', label: 'Manage Services', icon: '✨' },
    { id: 'appointments', label: 'Appointments', icon: '🗓️' },
    { id: 'categories', label: 'Categories', icon: '🗂️' },
    { id: 'reviews', label: 'Reviews & Ratings', icon: '⭐' },
    { id: 'payments', label: 'Payments & Reports', icon: '💰' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <aside
      className={`fixed md:relative left-0 top-24 md:top-0 h-[calc(100vh-96px)] md:h-auto bg-slate-900/95 backdrop-blur-md border-r border-slate-700/70 shadow-xl transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-64'
      } overflow-y-auto flex flex-col`}
    >
      <nav className="p-4 space-y-1.5 flex-grow mt-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as AdminTabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-teal-300'
              }`}
            >
              <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700/70">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-200 hover:bg-slate-800 hover:text-amber-100 transition border border-slate-700"
        >
          <span className="text-xl">🚪</span>
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
