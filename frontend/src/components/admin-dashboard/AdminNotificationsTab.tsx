import React from 'react';

interface AdminNotificationsTabProps {
  notifications: Array<{
    id: number;
    message: string;
    type: string;
    read: boolean;
    createdAt?: string;
  }>;
  onMarkAsRead: (id: number) => void;
}

const AdminNotificationsTab: React.FC<AdminNotificationsTabProps> = ({ notifications, onMarkAsRead }) => {
  if (notifications.length === 0) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-12 text-center max-w-3xl mx-auto border border-slate-700/60">
        <div className="text-6xl mb-4 text-emerald-200">📭</div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Inbox Zero!</h2>
        <p className="text-slate-400">System operations are nominal. No new alerts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📮</span> Admin Alert Center
          </h2>
          <button className="text-white/80 hover:text-white text-sm font-semibold transition bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
            Mark all as read
          </button>
        </div>
        
        <div className="divide-y divide-slate-700/60">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
              notif.read ? 'bg-slate-800/70 opacity-80' : 'bg-slate-900/30 border-l-4 border-teal-500 hover:bg-slate-900/40'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${
                  notif.type === 'registration' ? 'bg-slate-900/40 text-teal-200 border border-slate-700' :
                  notif.type === 'booking' ? 'bg-slate-900/40 text-teal-200 border border-slate-700' :
                  notif.type === 'cancellation' ? 'bg-slate-900/40 text-amber-200 border border-slate-700' :
                  notif.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                  notif.type === 'staff_pending' ? 'bg-slate-900/40 text-teal-200 border border-slate-700' :
                  notif.type === 'leave_request' ? 'bg-slate-900/40 text-teal-200 border border-slate-700' :
                  'bg-slate-900/40 text-teal-200 border border-slate-700'
                }`}>
                  {notif.type === 'registration' ? '👤' :
                   notif.type === 'booking' ? '📅' :
                   notif.type === 'cancellation' ? '⭕' :
                   notif.type === 'review' ? '⭐' :
                   notif.type === 'staff_pending' ? '🧑‍💼' :
                   notif.type === 'leave_request' ? '🌴' : 'ℹ️'}
                </div>
                <div>
                  <h4 className={`font-bold ${notif.read ? 'text-slate-400' : 'text-slate-100'} text-lg`}>{notif.message}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider bg-slate-900/40 inline-block px-2 py-0.5 rounded border border-slate-700">{notif.type}</p>
                  <p className="text-sm text-slate-400 mt-2">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString('en-US') : '—'}
                  </p>
                </div>
              </div>
              
              {!notif.read && (
                <button
                  onClick={() => onMarkAsRead(notif.id)}
                  className="px-4 py-2 bg-slate-900/40 text-teal-200 border border-slate-700 hover:bg-slate-900/60 font-bold rounded-lg text-sm transition shadow-sm whitespace-nowrap"
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

export default AdminNotificationsTab;
