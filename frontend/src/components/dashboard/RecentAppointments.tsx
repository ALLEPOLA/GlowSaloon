import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

interface RecentAppointment {
  Id: number;
  ServiceName: string;
  StaffName: string;
  AppointmentDate: string;
  Status: string;
}

interface RecentAppointmentsProps {
  appointments?: RecentAppointment[];
  title?: string;
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({
  title = 'Recent Appointments',
}) => {
  const [appointments, setAppointments] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await authService.getCustomerAppointments();
        
        // Filter completed appointments and get the last 3, sorted by date descending
        const completedAppointments = data
          .filter((apt: any) => apt.Status === 'Completed' || apt.Status === 'Cancelled')
          .sort((a: any, b: any) => new Date(b.AppointmentDate).getTime() - new Date(a.AppointmentDate).getTime())
          .slice(0, 3);
        
        setAppointments(completedAppointments);
      } catch (error) {
        console.error('Error fetching recent appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60">
      <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span>📋</span> {title}
      </h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : appointments.length > 0 ? (
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
                <tr key={apt.Id} className="border-b border-slate-700 hover:bg-slate-900/30 transition">
                  <td className="p-3 text-slate-100 font-semibold">{apt.ServiceName}</td>
                  <td className="p-3 text-slate-400">{apt.StaffName}</td>
                  <td className="p-3 text-slate-400">
                    {new Date(apt.AppointmentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="p-3">
                    <span
                      className={`${
                        apt.Status === 'Completed'
                          ? 'bg-emerald-900/40 text-emerald-200'
                          : 'bg-red-900/40 text-red-200'
                      } border border-slate-700 px-3 py-1 rounded-full text-sm font-semibold`}
                    >
                      {apt.Status === 'Completed' ? '✓' : '✕'} {apt.Status}
                    </span>
                  </td>
                  <td className="p-3">
                    {apt.Status === 'Completed' && (
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
      ) : (
        <p className="text-slate-400 text-center py-8">No recent appointments yet</p>
      )}
    </div>
  );
};

export default RecentAppointments;
