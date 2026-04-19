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
    <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-teal-500">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>📋</span> {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-3 font-bold text-gray-700">Service</th>
              <th className="text-left p-3 font-bold text-gray-700">Stylist</th>
              <th className="text-left p-3 font-bold text-gray-700">Date</th>
              <th className="text-left p-3 font-bold text-gray-700">Status</th>
              <th className="text-left p-3 font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id} className="border-b border-gray-100 hover:bg-emerald-50 transition">
                <td className="p-3 text-gray-800 font-semibold">{apt.service}</td>
                <td className="p-3 text-gray-600">{apt.stylist}</td>
                <td className="p-3 text-gray-600">{apt.date}</td>
                <td className="p-3">
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ {apt.status}
                  </span>
                </td>
                <td className="p-3">
                  {apt.status === 'Completed' && (
                    <button className="text-emerald-600 hover:text-emerald-700 font-semibold">
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
