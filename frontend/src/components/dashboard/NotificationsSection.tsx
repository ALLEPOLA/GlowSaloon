import React from 'react';

interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
}

interface NotificationsSectionProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: number) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications = [
    {
      id: 1,
      message: 'Appointment confirmed for tomorrow at 2:00 PM',
      type: 'confirmation',
      read: false,
    },
    {
      id: 2,
      message: 'Your appointment is tomorrow in 24 hours',
      type: 'reminder',
      read: false,
    },
    {
      id: 3,
      message: 'Appointment cancelled: Haircut session',
      type: 'cancellation',
      read: true,
    },
  ],
  onMarkAsRead = () => {},
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-slate-100">Notifications</h1>

      <div className="space-y-4">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700 ${
              !notif.read ? 'border-l-4 border-teal-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-100 font-semibold mb-2">{notif.message}</p>
                <p className="text-sm text-slate-400 capitalize">{notif.type}</p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => onMarkAsRead(notif.id)}
                  className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition font-semibold whitespace-nowrap"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSection;
