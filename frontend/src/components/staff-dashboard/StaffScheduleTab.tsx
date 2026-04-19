import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/authService';

interface Appointment {
  Id: number;
  CustomerName: string;
  ServiceName: string;
  AppointmentDate: string;
  AppointmentTime: string;
  Status: string;
}

const StaffScheduleTab: React.FC = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
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
        console.error('Failed to fetch staff schedule', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const getMonday = (date: Date) => {
    const current = new Date(date);
    const day = current.getDay(); // Sun=0 ... Sat=6
    const diff = day === 0 ? -6 : 1 - day;
    current.setDate(current.getDate() + diff);
    current.setHours(0, 0, 0, 0);
    return current;
  };

  const weeklyBookings = useMemo(() => {
    const monday = getMonday(new Date());
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const map: Record<string, { label: string; status: string }> = {};
    const activeStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed'];

    appointments.forEach((apt) => {
      if (!activeStatuses.includes(apt.Status)) return;

      const aptDate = new Date(`${apt.AppointmentDate.split('T')[0]}T00:00:00`);
      if (aptDate < monday || aptDate > sunday) return;

      const dayName = days[aptDate.getDay() === 0 ? 6 : aptDate.getDay() - 1];
      const hour = apt.AppointmentTime.split(':')[0];
      const timeKey = `${hour.padStart(2, '0')}:00`;
      const blockKey = `${dayName}-${timeKey}`;

      map[blockKey] = {
        label: `${apt.ServiceName} (${apt.CustomerName})`,
        status: apt.Status,
      };
    });

    return map;
  }, [appointments]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Schedule</h2>
        <div className="flex gap-4 text-sm font-medium">
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-100 rounded"></span> Available</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded"></span> Booked</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-200 rounded"></span> Off Day</div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-6 text-emerald-600 font-semibold animate-pulse">
          Loading schedule from database...
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-right pr-4 font-bold text-gray-400 text-sm py-2">Time</div>
            {days.map(day => (
              <div key={day} className="text-center font-bold text-gray-700 bg-gray-50 py-2 rounded-t-lg">
                {day}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {times.map(time => (
              <div key={time} className="grid grid-cols-8 gap-1">
                <div className="text-right pr-4 text-sm font-medium text-gray-500 py-3">{time}</div>
                {days.map(day => {
                  const isOffDay = day === 'Sunday'; // Example off day
                  const blockKey = `${day}-${time}`;
                  const booking = weeklyBookings[blockKey];

                  let blockClass = "bg-emerald-50 hover:bg-emerald-100 cursor-pointer border border-emerald-100/50";
                  let content = "";

                  if (isOffDay && !booking) {
                    blockClass = "bg-gray-100 pattern-diagonal-lines pattern-gray-200 pattern-size-2 cursor-not-allowed border border-gray-200";
                  } else if (booking) {
                    blockClass = booking.status === 'Completed'
                      ? "bg-purple-500 text-white shadow-sm border border-purple-600"
                      : "bg-blue-500 text-white shadow-sm border border-blue-600";
                    content = booking.label;
                  }

                  return (
                    <div key={blockKey} className={`rounded-md p-2 flex items-center justify-center text-xs font-bold transition-all ${blockClass}`}>
                      {content}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffScheduleTab;
