import React from 'react';

interface TopNavProps {
  userName?: string;
  onLogout: () => void;
  notifications: Array<{
    id: number;
    message: string;
    type: string;
    read: boolean;
  }>;
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
}

const TopNav: React.FC<TopNavProps> = ({
  userName = 'User',
  onLogout,
  notifications,
  unreadCount,
  onMarkAsRead,
}) => {
  return (
    <nav className="bg-slate-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-700/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌱</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                GlowVault
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative group">
              <button className="relative p-2 text-slate-200 hover:bg-slate-800 rounded-lg transition">
                🔔
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 max-h-96 overflow-y-auto z-50">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-bold text-slate-100">Notifications</h3>
                </div>
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-slate-700 hover:bg-slate-700/60 transition ${
                      !notif.read ? 'bg-slate-900/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-slate-200">{notif.message}</p>
                        <span className="text-xs text-slate-400 mt-1 block">{notif.type}</span>
                      </div>
                      {!notif.read && (
                        <button
                          onClick={() => onMarkAsRead(notif.id)}
                          className="text-xs bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-500 transition whitespace-nowrap"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
              {userName?.charAt(0).toUpperCase()}
            </div>

            {/* Profile Name and Dropdown */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <p className="font-semibold text-slate-100 text-sm">{userName}</p>
                <p className="text-xs text-slate-400">Customer</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
