import React from 'react';

interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  stylist: string;
  status: 'Confirmed' | 'Pending';
}

interface UpcomingAppointmentsProps {
  appointments?: Appointment[];
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments = [
    {
      id: 1,
      date: 'Tomorrow',
      time: '2:00 PM',
      service: 'Haircut & Styling',
      stylist: 'Sarah Johnson',
      status: 'Confirmed',
    },
    {
      id: 2,
      date: 'April 25, 2026',
      time: '3:30 PM',
      service: 'Hair Coloring',
      stylist: 'Emma Wilson',
      status: 'Pending',
    },
  ],
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-emerald-500">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>⏰</span> Upcoming Appointments
      </h2>
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map(apt => (
            <div
              key={apt.id}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-500 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{apt.service}</h3>
                  <p className="text-gray-600 text-sm">with {apt.stylist}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    apt.status === 'Confirmed'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
              <div className="flex items-center gap-6 text-gray-700 mb-4">
                <span>📅 {apt.date}</span>
                <span>🕐 {apt.time}</span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-semibold">
                  ↻ Reschedule
                </button>
                <button className="flex-1 px-4 py-2 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold">
                  ✕ Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center py-8">No upcoming appointments</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
