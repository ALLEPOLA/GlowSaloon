import React, { useState, useEffect } from 'react';
import api from '../../services/authService';

interface Appointment {
  Id: number;
  CustomerUserId: number;
  StaffUserId: number;
  ServiceId: number;
  AppointmentDate: string;
  AppointmentTime: string;
  Status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  TotalPrice: number;
  DurationMinutes: number;
  StaffName: string;
  ServiceName: string;
  ServiceImageUrl: string | null;
}

const AppointmentsTab: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviewedAppointmentIds, setReviewedAppointmentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsRes, reviewsRes] = await Promise.all([
        api.get('/customer/appointments'),
        api.get('/customer/reviews'),
      ]);

      if (appointmentsRes.data.success && Array.isArray(appointmentsRes.data.data)) {
        setAppointments(appointmentsRes.data.data);
      }

      if (reviewsRes.data.success && Array.isArray(reviewsRes.data.data)) {
        const ids = reviewsRes.data.data
          .map((review: any) => review.AppointmentId)
          .filter((id: any) => typeof id === 'number');
        setReviewedAppointmentIds(ids);
      }
    } catch (err) {
      setError('Failed to load appointments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isPast = (dateStr: string, timeStr: string) => {
    const aptDate = new Date(`${dateStr.split('T')[0]}T${timeStr}`);
    return aptDate < new Date();
  };

  const upcomingAppointments = appointments.filter(apt => !isPast(apt.AppointmentDate, apt.AppointmentTime));
  const pastAppointments = appointments.filter(apt => isPast(apt.AppointmentDate, apt.AppointmentTime));

  const formatTime = (timeStr: string) => {
    try {
      // timeStr might be "14:00:00", we want "2:00 PM"
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
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const handleAddReview = async (appointmentId: number) => {
    const ratingText = window.prompt('Rate your appointment (1 to 5 stars):', '5');
    if (!ratingText) return;

    const rating = Number(ratingText);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      alert('Please enter a valid rating between 1 and 5.');
      return;
    }

    const comment = window.prompt('Write your review (optional):', '') || '';

    try {
      await api.post('/customer/reviews', {
        appointmentId,
        rating,
        comment,
      });
      alert('Review submitted successfully.');
      fetchAppointments();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to submit review.';
      alert(message);
    }
  };

  if (loading) {
     return (
       <div className="flex justify-center items-center h-64">
         <div className="animate-pulse flex flex-col items-center">
           <div className="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
           <div className="text-gray-500 text-lg font-bold">Loading your appointments...</div>
         </div>
       </div>
     );
  }

  if (error) {
     return <div className="p-12 text-center text-red-500 text-xl font-bold bg-red-50 rounded-xl">Oops! {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">My Appointments</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your upcoming and past salon bookings.</p>
      </div>

      {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-700">No Appointments Yet</h2>
          <p className="text-gray-500 mt-2">Book an expert from the Browse Services tab to get started!</p>
        </div>
      )}

      {/* Upcoming */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Upcoming <span className="bg-emerald-100 text-emerald-700 text-sm py-0.5 px-2.5 rounded-full">{upcomingAppointments.length}</span>
          </h2>
          <div className="grid gap-6">
            {upcomingAppointments.map(apt => (
              <div
                key={apt.Id}
                className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500"></div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{apt.ServiceName}</h3>
                      <p className="text-gray-500 mt-1">with <span className="font-bold text-gray-700">{apt.StaffName}</span></p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        apt.Status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.Status === 'Pending' 
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {apt.Status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <span className="flex items-center gap-1.5 text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-100 font-medium">
                      📅 {formatDate(apt.AppointmentDate)}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-100 font-medium">
                      🕐 {formatTime(apt.AppointmentTime)}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-100 font-medium">
                      ${Number(apt.TotalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition font-bold shadow-sm shadow-emerald-200 text-sm">
                      ↻ Reschedule
                    </button>
                    <button className="px-5 py-2.5 border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl transition font-bold text-sm">
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {pastAppointments.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Past Appointments <span className="bg-gray-100 text-gray-600 text-sm py-0.5 px-2.5 rounded-full">{pastAppointments.length}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pastAppointments.map(apt => (
              <div key={apt.Id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{apt.ServiceName}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">with <span className="font-semibold text-gray-700">{apt.StaffName}</span></p>
                  </div>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    ✓ {apt.Status}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 mb-4 text-sm text-gray-600 font-medium">
                  {formatDate(apt.AppointmentDate)} • {formatTime(apt.AppointmentTime)}
                </div>
                {apt.Status === 'Completed' ? (
                  reviewedAppointmentIds.includes(apt.Id) ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      ✓ Review Added
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddReview(apt.Id)}
                      className="w-full py-2.5 bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-700 rounded-xl transition font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      Add Review
                    </button>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 bg-gray-100 border-2 border-gray-200 text-gray-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    Review available after completion
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;
