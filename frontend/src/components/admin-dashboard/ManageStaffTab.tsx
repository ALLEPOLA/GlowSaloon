import React, { useState, useEffect } from 'react';

interface Staff {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;

  status: string;
  joinDate?: string;
  registrationDate?: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface LeaveRequest {
  Id: number;
  StaffUserId: number;
  StaffName: string;
  StaffEmail: string;
  LeaveDate: string;
  LeaveType: string;
  Reason: string;
  Status: string;
  CreatedAt: string;
}

const ManageStaffTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStaff, setActiveStaff] = useState<Staff[]>([]);
  const [pendingStaff, setPendingStaff] = useState<Staff[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'leaves'>('active');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in again.');
        return;
      }

      const [activeResponse, pendingResponse, pendingLeavesResponse] = await Promise.all([
        fetch('http://localhost:3000/admin/staff', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('http://localhost:3000/admin/staff/pending', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('http://localhost:3000/admin/staff/leaves/pending', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      if (!activeResponse.ok || !pendingResponse.ok || !pendingLeavesResponse.ok) {
        throw new Error('Failed to fetch staff data');
      }

      const activeResult = await activeResponse.json();
      const pendingResult = await pendingResponse.json();
      const leavesResult = await pendingLeavesResponse.json();

      if (activeResult.success && Array.isArray(activeResult.data)) {
        setActiveStaff(activeResult.data);
      }

      if (pendingResult.success && Array.isArray(pendingResult.data)) {
        setPendingStaff(pendingResult.data);
      }
      if (leavesResult.success && Array.isArray(leavesResult.data)) {
        setPendingLeaves(leavesResult.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveReview = async (leaveId: number, decision: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`http://localhost:3000/admin/staff/leaves/${leaveId}/${decision}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`Failed to ${decision} leave request`);
      await fetchStaffData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleApproveStaff = async (userId: number, staffName: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:3000/admin/staff/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve staff');
      }

      // Show notification
      const notificationId = Date.now();
      setNotifications([...notifications, {
        id: notificationId,
        message: `✅ ${staffName} has been approved and added to the staff list!`,
        type: 'success'
      }]);

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }, 5000);

      // Refresh data
      await fetchStaffData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error approving staff:', err);
    }
  };

  const handleRejectStaff = async (userId: number) => {
    if (!window.confirm('Are you sure you want to reject this registration?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:3000/admin/staff/${userId}/reject`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject staff');
      }

      // Refresh data
      await fetchStaffData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error rejecting staff:', err);
    }
  };

  const filteredActiveStaff = activeStaff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingStaff = pendingStaff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/60">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>🧑‍💼</span> Manage Staff
          </h2>
          <p className="text-slate-400 mt-1">Organize your team of stylists and specialists.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/40 text-slate-100 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-slate-900/40 border border-slate-700 rounded-lg">
          <p className="text-amber-200 text-sm">{error}</p>
          <button 
            onClick={fetchStaffData}
            className="mt-2 px-3 py-1 bg-slate-800 text-amber-200 hover:bg-slate-700 rounded-md text-sm font-semibold transition border border-slate-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm animate-slide-down ${
              notif.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : notif.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-slate-700">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'active'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>✅</span> Active Staff ({activeStaff.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'pending'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⏳</span> Pending Verification ({pendingStaff.length})
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'leaves'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌴</span> Staff Leave Requests ({pendingLeaves.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div>
          </div>
          <span className="ml-3 text-slate-400">Loading staff data...</span>
        </div>
      ) : activeTab === 'active' ? (
        <>
          {/* ACTIVE STAFF */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActiveStaff.map(staff => (
              <div key={staff.id} className="border border-slate-700 rounded-2xl p-6 hover:shadow-lg transition bg-slate-900/30 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-900/40 text-teal-200 font-bold flex items-center justify-center text-2xl shadow-inner border border-slate-700">
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-100">{staff.name}</h3>
                <p className="text-emerald-600 font-semibold text-sm mb-1">{staff.specialization}</p>
                <p className="text-slate-400 text-sm mb-2">📧 {staff.email}</p>
                <p className="text-slate-400 text-sm mb-4">📱 {staff.phone}</p>
                <p className="text-slate-400 text-xs mb-4">📅 Joined: {staff.joinDate}</p>
               
                <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-2">
                  <button className="py-2 bg-slate-900/40 hover:bg-slate-900/60 text-teal-200 border border-slate-700 font-semibold rounded-lg text-sm transition">Edit Details</button>
                  <button className="py-2 bg-slate-900/40 hover:bg-slate-900/60 text-teal-200 border border-slate-700 font-semibold rounded-lg text-sm transition">Services</button>
                  <button className="py-2 bg-slate-900/40 hover:bg-slate-900/60 text-amber-200 border border-slate-700 font-semibold rounded-lg text-sm transition">Toggle Status</button>
                  <button className="py-2 bg-slate-900/40 hover:bg-slate-900/60 text-amber-200 border border-slate-700 font-semibold rounded-lg text-sm transition">Delete</button>
                </div>
              </div>
            ))}
            {filteredActiveStaff.length === 0 && !loading && (
              <div className="col-span-full py-12 text-center text-slate-400">
                {activeStaff.length === 0 ? 'No active staff members.' : 'No staff found matching your search.'}
              </div>
            )}
          </div>
        </>
      ) : activeTab === 'pending' ? (
        <>
          {/* PENDING STAFF */}
          <div className="space-y-4">
            {filteredPendingStaff.length > 0 ? (
              filteredPendingStaff.map(staff => (
                <div
                  key={staff.id}
                  className="border border-slate-700 rounded-xl p-6 bg-slate-900/30 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-full bg-slate-900/40 text-teal-200 font-bold flex items-center justify-center text-xl border border-slate-700">
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-100">{staff.name}</h3>
                        <p className="text-sm text-slate-400">📧 {staff.email}</p>
                        <p className="text-sm text-slate-400">📱 {staff.phone}</p>
                        {staff.specialization && (
                          <p className="text-sm text-teal-300 font-semibold mt-1">✨ {staff.specialization}</p>
                        )}
                       
                        <p className="text-xs text-slate-400 mt-1">Registered: {staff.registrationDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveStaff(staff.userId, staff.name)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-sm transition whitespace-nowrap"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleRejectStaff(staff.userId)}
                        className="px-4 py-2 bg-slate-900/40 hover:bg-slate-900/60 text-amber-200 font-bold rounded-lg text-sm transition whitespace-nowrap border border-slate-700"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                {pendingStaff.length === 0 ? 'No pending staff registrations.' : 'No pending staff found matching your search.'}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {pendingLeaves.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No pending leave requests.</div>
          ) : (
            pendingLeaves.map((leave) => (
              <div key={leave.Id} className="border border-slate-700 rounded-xl p-6 bg-slate-900/30 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{leave.StaffName}</h3>
                    <p className="text-sm text-slate-400">📧 {leave.StaffEmail}</p>
                    <p className="text-sm text-slate-300 mt-1">📅 {new Date(leave.LeaveDate).toLocaleDateString('en-US')}</p>
                    <p className="text-sm text-teal-300 font-semibold mt-1">Type: {leave.LeaveType}</p>
                    <p className="text-sm text-slate-400 mt-1">Reason: {leave.Reason || 'N/A'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLeaveReview(leave.Id, 'approve')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-sm transition whitespace-nowrap"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleLeaveReview(leave.Id, 'reject')}
                      className="px-4 py-2 bg-slate-900/40 hover:bg-slate-900/60 text-amber-200 font-bold rounded-lg text-sm transition whitespace-nowrap border border-slate-700"
                    >
                      ❌ Decline
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Add animations via style tag */}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default ManageStaffTab;
