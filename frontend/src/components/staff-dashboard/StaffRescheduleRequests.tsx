import React, { useState, useEffect } from 'react';
import api from '../../services/authService';

interface RescheduleRequest {
  Id: number;
  AppointmentId: number;
  CustomerName: string;
  ServiceName: string;
  OldDate: string;
  OldTime: string;
  NewAppointmentDate: string;
  NewAppointmentTime: string;
  Reason: string;
  CreatedAt: string;
}

const StaffRescheduleRequests: React.FC = () => {
  const [requests, setRequests] = useState<RescheduleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const fetchRescheduleRequests = async () => {
    try {
      const response = await api.get('/staff/reschedule-requests');
      setRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reschedule requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRescheduleRequests();
  }, []);

  const handleApprove = async (requestId: number) => {
    setProcessing(requestId);
    try {
      const response = await api.put(`/staff/reschedule-requests/${requestId}/approve`);
      setMessage(response.data.message);
      setTimeout(() => {
        fetchRescheduleRequests();
        setMessage('');
      }, 1500);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: number) => {
    setProcessing(requestId);
    try {
      const response = await api.put(`/staff/reschedule-requests/${requestId}/reject`);
      setMessage(response.data.message);
      setTimeout(() => {
        fetchRescheduleRequests();
        setMessage('');
      }, 1500);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span>🔄</span> Reschedule Requests
        {requests.length > 0 && (
          <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {requests.length}
          </span>
        )}
      </h2>

      {message && (
        <div className="p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-200 mb-4">
          {message}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No pending reschedule requests</p>
          <p className="text-slate-500 text-sm mt-2">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div
              key={request.Id}
              className="bg-slate-900/40 p-6 rounded-xl border border-slate-700 hover:shadow-lg transition"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{request.ServiceName}</h3>
                    <p className="text-slate-400 text-sm">Customer: {request.CustomerName}</p>
                  </div>
                  <span className="bg-amber-900/40 text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
                    Pending
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-slate-400 text-xs">Current Appointment</p>
                    <p className="text-slate-200 font-mono">{formatDate(request.OldDate)}</p>
                    <p className="text-slate-300 font-mono">{formatTime(request.OldTime)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-slate-400 text-xs">Requested New Time</p>
                    <p className="text-slate-200 font-mono">{formatDate(request.NewAppointmentDate)}</p>
                    <p className="text-slate-300 font-mono">{formatTime(request.NewAppointmentTime)}</p>
                  </div>
                </div>

                {request.Reason && (
                  <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700 mb-4">
                    <p className="text-slate-400 text-xs mb-1">Reason:</p>
                    <p className="text-slate-300 text-sm italic">{request.Reason}</p>
                  </div>
                )}

                <p className="text-slate-500 text-xs">
                  Requested on {new Date(request.CreatedAt).toLocaleDateString()} at{' '}
                  {new Date(request.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => handleReject(request.Id)}
                  disabled={processing === request.Id}
                  className="flex-1 px-4 py-2 border border-slate-600 text-red-200 hover:bg-red-900/20 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing === request.Id ? 'Processing...' : '✕ Reject'}
                </button>
                <button
                  onClick={() => handleApprove(request.Id)}
                  disabled={processing === request.Id}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing === request.Id ? 'Processing...' : '✓ Approve'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffRescheduleRequests;
