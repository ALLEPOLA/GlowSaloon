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
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60">
      <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span>⏰</span> Upcoming Appointments
      </h2>
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map(apt => (
            <div
              key={apt.id}
              className="bg-slate-900/40 p-6 rounded-xl border border-slate-700 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{apt.service}</h3>
                  <p className="text-slate-400 text-sm">with {apt.stylist}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    apt.status === 'Confirmed'
                      ? 'bg-emerald-900/40 text-emerald-200 border border-slate-700'
                      : 'bg-amber-900/40 text-amber-200 border border-slate-700'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
              <div className="flex items-center gap-6 text-slate-300 mb-4">
                <span>📅 {apt.date}</span>
                <span>🕐 {apt.time}</span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition font-semibold">
                  ↻ Reschedule
                </button>
                <button className="flex-1 px-4 py-2 border border-slate-600 text-amber-200 hover:bg-slate-800 rounded-lg transition font-semibold">
                  ✕ Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center py-8">No upcoming appointments</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
