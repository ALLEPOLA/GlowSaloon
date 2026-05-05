import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import RescheduleModal from './RescheduleModal';

interface Appointment {
  Id: number;
  AppointmentDate: string;
  AppointmentTime: string;
  ServiceName: string;
  StaffName: string;
  Status: string;
  StaffUserId?: number;
}

interface UpcomingAppointmentsProps {
  appointments?: Appointment[];
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, appointmentId: 0 });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancellationMessage, setCancellationMessage] = useState('');

  const fetchAppointments = async () => {
    try {
      const data = await authService.getCustomerAppointments();
      
      // Filter future appointments (Confirmed or Pending status)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingAppointments = data
        .filter((apt: any) => {
          const appointmentDate = new Date(apt.AppointmentDate);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate >= today && (apt.Status === 'Confirmed' || apt.Status === 'Pending');
        })
        .sort((a: any, b: any) => new Date(a.AppointmentDate).getTime() - new Date(b.AppointmentDate).getTime());
      
      setAppointments(upcomingAppointments);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    // Auto-refresh every 30 seconds to catch any status changes from staff
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);
    
    if (appointmentDay.getTime() === today.getTime()) {
      return 'Today';
    } else if (appointmentDay.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return appointmentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const handleRescheduleClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setRescheduleModal({ isOpen: true, appointmentId: apt.Id });
  };

  const handleCancelClick = async (appointmentId: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const result = await authService.cancelAppointment(appointmentId);
      setCancellationMessage(result.message);
      setTimeout(() => {
        fetchAppointments();
        setCancellationMessage('');
      }, 1500);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleModalClose = () => {
    setRescheduleModal({ isOpen: false, appointmentId: 0 });
    setSelectedAppointment(null);
  };

  const handleRescheduleSuccess = () => {
    setCancellationMessage('Reschedule request submitted successfully!');
    setTimeout(() => {
      fetchAppointments();
      setCancellationMessage('');
    }, 1500);
  };

  return (
    <>
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60">
        <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <span>⏰</span> Upcoming Appointments
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {cancellationMessage && (
              <div className="p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-200 mb-4">
                {cancellationMessage}
              </div>
            )}
            {appointments.map(apt => (
              <div
                key={apt.Id}
                className="bg-slate-900/40 p-6 rounded-xl border border-slate-700 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{apt.ServiceName}</h3>
                    <p className="text-slate-400 text-sm">with {apt.StaffName}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      apt.Status === 'Confirmed'
                        ? 'bg-emerald-900/40 text-emerald-200 border border-slate-700'
                        : 'bg-amber-900/40 text-amber-200 border border-slate-700'
                    }`}
                  >
                    {apt.Status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-slate-300 mb-4">
                  <span>📅 {formatDate(apt.AppointmentDate)}</span>
                  <span>🕐 {apt.AppointmentTime}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRescheduleClick(apt)}
                    className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition font-semibold"
                  >
                    ↻ Reschedule
                  </button>
                  <button
                    onClick={() => handleCancelClick(apt.Id)}
                    className="flex-1 px-4 py-2 border border-slate-600 text-amber-200 hover:bg-slate-800 rounded-lg transition font-semibold"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No upcoming appointments</p>
        )}
      </div>

      {selectedAppointment && (
        <RescheduleModal
          isOpen={rescheduleModal.isOpen}
          appointmentId={rescheduleModal.appointmentId}
          serviceName={selectedAppointment.ServiceName}
          staffName={selectedAppointment.StaffName}
          currentDate={selectedAppointment.AppointmentDate}
          currentTime={selectedAppointment.AppointmentTime}
          onClose={handleModalClose}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </>
  );
};

export default UpcomingAppointments;
