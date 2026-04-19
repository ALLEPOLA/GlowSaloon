import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/authService';

interface Appointment {
  Id: number;
  AppointmentDate: string;
  Status: string;
}

const StaffStatsCards: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/staff/appointments');
        if (res.data.success && Array.isArray(res.data.data)) {
          setAppointments(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch staff stats data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const counts = useMemo(() => {
    const getLocalDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalDateString(new Date());
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);

    let todayAppointments = 0;
    let thisMonthAppointments = 0;
    let completedThisMonth = 0;
    let pendingUpcoming = 0;

    appointments.forEach((apt) => {
      const datePart = apt.AppointmentDate.split('T')[0];
      const aptDate = new Date(`${datePart}T00:00:00`);
      const aptMonth = aptDate.getMonth();
      const aptYear = aptDate.getFullYear();
      const isThisMonth = aptMonth === currentMonth && aptYear === currentYear;
      const isToday = datePart === todayStr;
      const isPendingFlow = ['Pending', 'Confirmed', 'In Progress'].includes(apt.Status);

      if (isToday) {
        todayAppointments += 1;
      }

      if (isThisMonth) {
        thisMonthAppointments += 1;
      }

      if (isThisMonth && apt.Status === 'Completed') {
        completedThisMonth += 1;
      }

      if (isPendingFlow && aptDate >= new Date(`${todayStr}T00:00:00`) && aptDate <= sevenDaysFromNow) {
        pendingUpcoming += 1;
      }
    });

    return {
      todayAppointments,
      thisMonthAppointments,
      completedThisMonth,
      pendingUpcoming,
    };
  }, [appointments]);

  const valueOrLoading = (value: number) => (loading ? '...' : String(value));

  const stats = [
    { 
      title: "Today's Appointments", 
      value: valueOrLoading(counts.todayAppointments), 
      change: "Live from database", 
      icon: "📅",
      gradient: "from-teal-600 to-emerald-600"
    },
    { 
      title: "This Month", 
      value: valueOrLoading(counts.thisMonthAppointments), 
      change: "Current month total", 
      icon: "📊",
      gradient: "from-teal-600 to-emerald-600"
    },
    { 
      title: "Completed", 
      value: valueOrLoading(counts.completedThisMonth), 
      change: "This month", 
      icon: "✅",
      gradient: "from-teal-600 to-emerald-600"
    },
    { 
      title: "Pending / Upcoming", 
      value: valueOrLoading(counts.pendingUpcoming), 
      change: "Next 7 days", 
      icon: "⏳",
      gradient: "from-teal-600 to-emerald-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl p-6 relative overflow-hidden border border-slate-700/60 hover:border-teal-500/40 transition transform hover:-translate-y-1">
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full`}></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-sm font-semibold">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-100 mt-1">{stat.value}</h3>
              </div>
              <span className="text-3xl filter drop-shadow-md">{stat.icon}</span>
            </div>
            <p className="text-sm text-slate-300 font-medium bg-slate-900/40 inline-block px-2 py-1 rounded-md border border-slate-700/60">
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaffStatsCards;
