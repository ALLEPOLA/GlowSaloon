import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/authService';

interface Appointment {
  Id: number;
  AppointmentDate: string;
  Status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'In Progress' | string;
}

interface Stat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

const StatsCards: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/customer/appointments');
        if (res.data.success && Array.isArray(res.data.data)) {
          setAppointments(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch customer appointment stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const counts = useMemo(() => {
    const todayStr = getLocalDateString(new Date());
    const upcomingStatuses = ['Pending', 'Confirmed', 'In Progress'];

    let total = 0;
    let upcoming = 0;
    let completed = 0;
    let cancelled = 0;

    appointments.forEach((apt) => {
      total += 1;

      const aptDate = apt.AppointmentDate.split('T')[0];
      if (upcomingStatuses.includes(apt.Status) && aptDate >= todayStr) {
        upcoming += 1;
      }

      if (apt.Status === 'Completed') {
        completed += 1;
      }

      if (apt.Status === 'Cancelled') {
        cancelled += 1;
      }
    });

    return { total, upcoming, completed, cancelled };
  }, [appointments]);

  const valueOrLoading = (value: number) => (loading ? '...' : String(value));

  const stats: Stat[] = [
    { label: 'Total Appointments', value: valueOrLoading(counts.total), icon: '📅', color: 'from-slate-700 to-slate-800' },
    { label: 'Upcoming', value: valueOrLoading(counts.upcoming), icon: '⏰', color: 'from-teal-700 to-teal-800' },
    { label: 'Completed', value: valueOrLoading(counts.completed), icon: '✅', color: 'from-emerald-700 to-emerald-800' },
    { label: 'Cancelled', value: valueOrLoading(counts.cancelled), icon: '❌', color: 'from-amber-700 to-amber-800' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-2xl border border-slate-600/50 hover:shadow-xl transition transform hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm opacity-90">{stat.label}</h3>
            <span className="text-3xl">{stat.icon}</span>
          </div>
          <p className="text-4xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
