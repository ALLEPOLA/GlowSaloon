import React, { useState } from 'react';
import { authService } from '../../services/authService';

interface RescheduleModalProps {
  isOpen: boolean;
  appointmentId: number;
  serviceName: string;
  staffName: string;
  currentDate: string;
  currentTime: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  appointmentId,
  serviceName,
  staffName,
  currentDate,
  currentTime,
  onClose,
  onSuccess,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newDate || !newTime) {
      setError('Please select a new date and time');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.requestReschedule(appointmentId, newDate, newTime, reason);
      setSuccess(result.message || 'Reschedule request submitted successfully');
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit reschedule request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Reschedule Appointment</h2>
        <p className="text-slate-400 text-sm mb-6">Request a new time for your appointment</p>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400">Service</p>
            <p className="text-slate-100 font-semibold">{serviceName}</p>
            <p className="text-xs text-slate-400 mt-2">with {staffName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Current Date</p>
              <p className="text-slate-200 font-mono">{new Date(currentDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-400">Current Time</p>
              <p className="text-slate-200 font-mono">{currentTime}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Reason (Optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why you need to reschedule..."
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 resize-none h-24"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-200 text-sm">
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>Submit Request</>
              )}
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Your stylist will review and approve your reschedule request
        </p>
      </div>
    </div>
  );
};

export default RescheduleModal;
