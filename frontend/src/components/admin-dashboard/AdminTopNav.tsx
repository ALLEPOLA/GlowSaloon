import React from 'react';

interface AdminTopNavProps {
  userName?: string;
  onLogout: () => void;
  notifications: Array<{
    id: number;
    message: string;
    type: string;
    read: boolean;
    createdAt?: string;
  }>;
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({
  userName = 'Admin User',
  onLogout,
  notifications,
  unreadCount,
  onMarkAsRead,
}) => {
  return (
    <nav className="bg-slate-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-700/70">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-24">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-teal-300">👑</span>
              <h1 className="text-2xl font-black bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent tracking-tight">
                GlowVault Admin
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Notifications */}
            <div className="relative group">
              <button className="relative p-2 text-slate-200 hover:bg-slate-800 rounded-lg transition">
                🔔
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 max-h-96 overflow-y-auto z-50">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-bold text-slate-100">System Alerts</h3>
                </div>
                {notifications.length === 0 && (
                  <div className="p-4 text-sm text-slate-400">No notifications yet.</div>
                )}
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-slate-700/60 hover:bg-slate-900/40 transition ${
                      !notif.read ? 'bg-slate-900/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-slate-200 font-medium">{notif.message}</p>
                        <span className="text-xs text-teal-300 mt-1 block uppercase font-bold">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleString('en-US') : notif.type}
                        </span>
                      </div>
                      {!notif.read && (
                        <button
                          onClick={() => onMarkAsRead(notif.id)}
                          className="text-xs bg-slate-900/40 text-teal-200 px-2 py-1 rounded hover:bg-slate-900/60 border border-slate-700 transition"
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md border border-slate-700">
              {userName?.charAt(0).toUpperCase()}
            </div>

            {/* Profile Name */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <p className="font-bold text-slate-100 text-sm">{userName}</p>
                <p className="text-xs text-teal-300 font-semibold uppercase tracking-wider">Super Admin</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="px-7 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-amber-200 font-semibold rounded-xl transition border border-slate-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminTopNav;
