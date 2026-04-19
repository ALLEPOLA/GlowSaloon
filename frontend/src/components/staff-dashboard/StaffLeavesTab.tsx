import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/authService';

const StaffLeavesTab: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/staff/leaves');
      if (res.data.success && Array.isArray(res.data.data)) {
        setLeaves(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaves', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const monthlyApprovedLeaves = useMemo(() => {
    const now = new Date();
    return leaves.filter((l) => {
      if (l.Status !== 'Approved') return false;
      const d = new Date(l.LeaveDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [leaves]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate) {
      alert('Please select leave date.');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/staff/leaves', { leaveDate, leaveType, reason });
      setLeaveDate('');
      setLeaveType('Sick Leave');
      setReason('');
      await fetchLeaves();
      alert('Leave request submitted.');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (leaveId: number) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try {
      await api.delete(`/staff/leaves/${leaveId}`);
      await fetchLeaves();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to cancel leave request');
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Apply Leave Form */}
      <div className="lg:col-span-1 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 h-fit border border-slate-700/60">
        <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <span>📝</span> Request Time Off
        </h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Date</label>
            <input value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} type="date" className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-slate-900/40 text-slate-100" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Leave Type</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-100 bg-slate-900/40">
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Annual Vacation</option>
              <option>Unpaid Leave</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Reason (Optional)</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none bg-slate-900/40 text-slate-100"></textarea>
          </div>
          
          <button disabled={submitting} type="submit" className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-teal-500/20 transition disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
        <div className="mt-4 rounded-xl bg-slate-900/40 border border-slate-700 p-3 text-sm text-slate-200 font-semibold">
          Monthly Approved Leaves: {monthlyApprovedLeaves}
        </div>
      </div>

      {/* Leave History */}
      <div className="lg:col-span-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/60">
        <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <span>📜</span> Leave History
        </h2>
        
        <div className="overflow-hidden border border-slate-700 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/40 text-slate-300 text-sm border-b border-slate-700">
                <th className="px-6 py-4 font-semibold">Date Requested</th>
                <th className="px-6 py-4 font-semibold">Reason</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {loading ? (
                <tr><td className="px-6 py-4 text-slate-400" colSpan={4}>Loading leave history...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td className="px-6 py-4 text-slate-400" colSpan={4}>No leave requests found.</td></tr>
              ) : leaves.map((leave) => (
                <tr key={leave.Id} className="hover:bg-slate-900/30 transition">
                  <td className="px-6 py-4 text-slate-100 font-medium">{formatDate(leave.LeaveDate)}</td>
                  <td className="px-6 py-4 text-slate-300">{leave.LeaveType} {leave.Reason ? `- ${leave.Reason}` : ''}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      leave.Status === 'Approved' ? 'bg-emerald-900/30 text-emerald-200 border border-slate-700' :
                      leave.Status === 'Pending' ? 'bg-amber-900/30 text-amber-200 border border-slate-700' :
                      'bg-slate-900/40 text-slate-200 border border-slate-700'
                    }`}>
                      {leave.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {leave.Status === 'Pending' ? (
                      <button onClick={() => handleCancel(leave.Id)} className="text-sm text-amber-200 font-semibold hover:text-amber-100 transition">Cancel</button>
                    ) : (
                      <span className="text-slate-500 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffLeavesTab;
