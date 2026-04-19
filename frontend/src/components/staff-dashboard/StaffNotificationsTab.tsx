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
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-3xl mx-auto">
        <div className="text-6xl mb-4 text-emerald-200">📭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h2>
        <p className="text-gray-500">You don't have any notifications right now.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📮</span> Notification Center
          </h2>
          <button className="text-white/80 hover:text-white text-sm font-semibold transition bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            Mark all as read
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
              notif.read ? 'bg-white opacity-70' : 'bg-emerald-50/50 border-l-4 border-emerald-500 hover:bg-emerald-50'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${
                  notif.type === 'appointment_new' ? 'bg-blue-100 text-blue-600' :
                  notif.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                  notif.type === 'cancellation' ? 'bg-red-100 text-red-600' :
                  notif.type === 'appointment_update' ? 'bg-purple-100 text-purple-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {notif.type === 'appointment_new' ? '📅' :
                   notif.type === 'review' ? '⭐' :
                   notif.type === 'cancellation' ? '❌' :
                   notif.type === 'appointment_update' ? '🔄' : '🔔'}
                </div>
                <div>
                  <h4 className={`font-bold ${notif.read ? 'text-gray-600' : 'text-gray-800'}`}>{notif.message}</h4>
                  <p className="text-sm font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString('en-US') : notif.type}
                  </p>
                </div>
              </div>
              
              {!notif.read && (
                <button
                  onClick={() => onMarkAsRead(notif.id)}
                  className="px-4 py-2 bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50 font-bold rounded-lg text-sm transition shadow-sm"
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
