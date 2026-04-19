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

const TodayAppointments: React.FC = () => {
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
    // Set an interval to auto-refresh every 30 seconds for a real-time feel
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/staff/appointments/${id}/status`, { status: newStatus });
      fetchAppointments(); // Re-fetch to update UI
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200">Pending</span>;
      case 'Confirmed':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">Confirmed</span>;
      case 'In Progress':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-200 animate-pulse">In Progress</span>;
      case 'Completed':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">Completed</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-200">Cancelled/Declined</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
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

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter ONLY today's appointments
  const todayAppointments = appointments.filter(apt => {
    const aptDate = apt.AppointmentDate.split('T')[0];
    const today = getLocalDateString(new Date());
    return aptDate === today;
  });

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-teal-300 font-bold">Loading today's schedule...</div>;
  }

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📋</span> Today's Appointments
        </h3>
        <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/10">
          {todayAppointments.length} Total
        </span>
      </div>
      
      <div className="divide-y divide-slate-700/60">
        {todayAppointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <span className="text-4xl block mb-2">🌴</span>
            No appointments scheduled for today. Enjoy your time!
          </div>
        ) : (
          todayAppointments.map((apt) => (
            <div key={apt.Id} className="p-6 hover:bg-slate-800 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900/50 text-teal-200 font-bold text-xl flex items-center justify-center shadow-inner uppercase border border-slate-700">
                  {apt.CustomerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-lg">{apt.CustomerName}</h4>
                  <p className="text-teal-300 font-medium">{apt.ServiceName}</p>
                  <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
                    <span>🕒</span> {formatTime(apt.AppointmentTime)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-3">
                {getStatusBadge(apt.Status)}
                
                <div className="flex gap-2">
                  {apt.Status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => updateStatus(apt.Id, 'Confirmed')}
                        className="px-3 py-1.5 bg-slate-900/40 hover:bg-slate-900/60 text-teal-200 border border-slate-700 rounded-md text-sm font-semibold transition shadow-sm"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => updateStatus(apt.Id, 'Cancelled')}
                        className="px-3 py-1.5 bg-slate-900/40 hover:bg-slate-900/60 text-amber-200 border border-slate-700 rounded-md text-sm font-semibold transition shadow-sm"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {apt.Status === 'Confirmed' && (
                    <button 
                      onClick={() => updateStatus(apt.Id, 'In Progress')}
                      className="px-3 py-1.5 bg-slate-900/40 hover:bg-slate-900/60 text-teal-200 border border-slate-700 rounded-md text-sm font-semibold transition shadow-sm"
                    >
                      Start Progress
                    </button>
                  )}
                  {apt.Status === 'In Progress' && (
                    <button 
                      onClick={() => updateStatus(apt.Id, 'Completed')}
                      className="px-3 py-1.5 bg-slate-900/40 hover:bg-slate-900/60 text-emerald-200 border border-slate-700 rounded-md text-sm font-semibold transition shadow-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;
