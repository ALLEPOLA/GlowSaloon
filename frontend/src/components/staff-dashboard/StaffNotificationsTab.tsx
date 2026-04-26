import React from 'react';

interface StaffNotificationsTabProps {
  notifications: Array<{
    id: number;
    message: string;
    type: string;
    read: boolean;
    createdAt?: string;
  }>;
  onMarkAsRead: (id: number) => void;
}

const StaffNotificationsTab: React.FC<StaffNotificationsTabProps> = ({ notifications, onMarkAsRead }) => {
  if (notifications.length === 0) {
    return (
      <div className="bg-slate-800/95 rounded-2xl shadow-2xl p-12 text-center max-w-3xl mx-auto border border-slate-700">
        <div className="text-6xl mb-4 text-emerald-300">📭</div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">All Caught Up!</h2>
        <p className="text-slate-400">You don't have any notifications right now.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📮</span> Notification Center
          </h2>
          <button className="text-white/80 hover:text-white text-sm font-semibold transition bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            Mark all as read
          </button>
        </div>
        
        <div className="divide-y divide-slate-700">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
              notif.read ? 'bg-slate-800 opacity-80' : 'bg-emerald-900/15 border-l-4 border-emerald-500 hover:bg-emerald-900/20'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${
                  notif.type === 'appointment_new' ? 'bg-blue-900/30 text-blue-300' :
                  notif.type === 'review' ? 'bg-yellow-900/30 text-yellow-300' :
                  notif.type === 'cancellation' ? 'bg-red-900/30 text-red-300' :
                  notif.type === 'appointment_update' ? 'bg-purple-900/30 text-purple-300' :
                  'bg-emerald-900/30 text-emerald-300'
                }`}>
                  {notif.type === 'appointment_new' ? '📅' :
                   notif.type === 'review' ? '⭐' :
                   notif.type === 'cancellation' ? '❌' :
                   notif.type === 'appointment_update' ? '🔄' : '🔔'}
                </div>
                <div>
                  <h4 className={`font-bold ${notif.read ? 'text-slate-400' : 'text-slate-100'}`}>{notif.message}</h4>
                  <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString('en-US') : notif.type}
                  </p>
                </div>
              </div>
              
              {!notif.read && (
                <button
                  onClick={() => onMarkAsRead(notif.id)}
                  className="px-4 py-2 bg-slate-800 text-emerald-300 border border-slate-600 hover:bg-slate-700 font-bold rounded-lg text-sm transition shadow-sm"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffNotificationsTab;
