import React from 'react';

interface RecentAppointment {
  id: number;
  service: string;
  stylist: string;
  date: string;
  status: 'Completed' | 'Cancelled';
}

interface RecentAppointmentsProps {
  appointments?: RecentAppointment[];
  title?: string;
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({
  appointments = [
    {
      id: 1,
      service: 'Manicure & Pedicure',
      stylist: 'Lisa Anderson',
      date: 'April 10, 2026',
      status: 'Completed',
    },
    {
      id: 2,
      service: 'Massage Therapy',
      stylist: 'Mike Chen',
      date: 'April 5, 2026',
      status: 'Completed',
    },
    {
      id: 3,
      service: 'Hair Spa Treatment',
      stylist: 'Sarah Johnson',
      date: 'March 30, 2026',
      status: 'Completed',
    },
  ],
  title = 'Recent Appointments',
}) => {
  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60">
      <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span>📋</span> {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-700">
              <th className="text-left p-3 font-bold text-slate-300">Service</th>
              <th className="text-left p-3 font-bold text-slate-300">Stylist</th>
              <th className="text-left p-3 font-bold text-slate-300">Date</th>
              <th className="text-left p-3 font-bold text-slate-300">Status</th>
              <th className="text-left p-3 font-bold text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id} className="border-b border-slate-700 hover:bg-slate-900/30 transition">
                <td className="p-3 text-slate-100 font-semibold">{apt.service}</td>
                <td className="p-3 text-slate-400">{apt.stylist}</td>
                <td className="p-3 text-slate-400">{apt.date}</td>
                <td className="p-3">
                  <span className="bg-emerald-900/40 text-emerald-200 border border-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ {apt.status}
                  </span>
                </td>
                <td className="p-3">
                  {apt.status === 'Completed' && (
                    <button className="text-teal-300 hover:text-teal-200 font-semibold">
                      ⭐ Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAppointments;
