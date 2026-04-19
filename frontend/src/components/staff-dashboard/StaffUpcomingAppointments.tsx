import React, { useState, useEffect } from 'react';
import api from '../../services/authService';

interface Appointment {
  Id: number;
  CustomerName: string;
  ServiceName: string;
  AppointmentDate: string;
  AppointmentTime: string;
  Status: string;
}

const StaffUpcomingAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/staff/appointments');
      if (res.data.success && Array.isArray(res.data.data)) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch staff appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      if (newStatus === 'Cancelled') {
        const confirmCancel = window.confirm("Are you sure you want to decline/cancel this appointment?");
        if (!confirmCancel) return;
      }
      await api.put(`/staff/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) {
      return timeStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter future appointments specifically (ignoring past/today for this widget if needed, or simply all future/pending)
  const isFuture = (dateStr: string) => {
    const aptDate = new Date(dateStr.split('T')[0]);
    const today = new Date();
    today.setHours(0,0,0,0);
    return aptDate > today; // Strictly future technically, but we can include today's that aren't past
  };

  const upcoming = appointments.filter(apt => isFuture(apt.AppointmentDate));

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-teal-300 font-bold">Loading upcoming schedule...</div>;
  }

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔮</span> Upcoming (Next 7 Days)
        </h3>
        <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/10">
          {upcoming.length} Future
        </span>
      </div>
      
      <div className="divide-y divide-slate-700/60">
        {upcoming.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            No future appointments scheduled right now.
          </div>
        ) : (
          upcoming.map((apt) => (
            <div key={apt.Id} className="p-5 hover:bg-slate-800 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-100">{apt.CustomerName}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    apt.Status === 'Confirmed' ? 'bg-teal-900/40 text-teal-200 border border-slate-700' :
                    apt.Status === 'Pending' ? 'bg-amber-900/30 text-amber-200 border border-slate-700' :
                    'bg-slate-900/40 text-slate-200 border border-slate-700'
                  }`}>
                    {apt.Status}
                  </span>
                </div>
                <p className="text-teal-300 font-medium text-sm">{apt.ServiceName}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">📅 {formatDate(apt.AppointmentDate)}</span>
                  <span className="flex items-center gap-1">🕒 {formatTime(apt.AppointmentTime)}</span>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                {apt.Status === 'Pending' && (
                  <button 
                    onClick={() => updateStatus(apt.Id, 'Confirmed')}
                    className="text-sm font-semibold text-teal-200 hover:text-teal-100 hover:bg-slate-900/40 px-3 py-1.5 rounded-md transition border border-slate-700"
                  >
                    Confirm
                  </button>
                )}
                {apt.Status !== 'Cancelled' && apt.Status !== 'Completed' && (
                  <button 
                    onClick={() => updateStatus(apt.Id, 'Cancelled')}
                    className="text-sm font-semibold text-amber-200 hover:text-amber-100 hover:bg-slate-900/40 px-3 py-1.5 rounded-md transition border border-slate-700"
                  >
                    Decline/Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        
        <div className="p-4 bg-slate-900/30 text-center border-t border-slate-700/60">
          <button className="text-teal-300 hover:text-teal-200 font-bold text-sm transition">
            View full calendar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffUpcomingAppointments;
