import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/authService';

interface StaffProfileTabProps {
  user?: { name: string; email: string; phone?: string; roleId?: number };
}

const StaffProfileTab: React.FC<StaffProfileTabProps> = ({ user }) => {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get('/staff/leaves');
        if (res.data.success && Array.isArray(res.data.data)) {
          setLeaves(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch staff leaves for profile', error);
      }
    };
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Block */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-5xl shadow-lg relative group cursor-pointer overflow-hidden">
              <span className="group-hover:opacity-10 transition z-10 block">👩‍💼</span>
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold z-20">
                Upload Photo
              </div>
            </div>
          </div>
          
          <div className="mt-20 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{user?.name || 'Staff Member'}</h2>
              <p className="text-emerald-600 font-semibold text-lg flex items-center gap-1 mt-1">
                <span>✂️</span> Master Stylist
              </p>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg shadow hover:shadow-lg transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Leave</h3>
        <div className="inline-flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-2xl">🌴</span>
          <div>
            <p className="text-sm text-gray-600">Approved leaves this month</p>
            <p className="text-2xl font-bold text-emerald-700">{monthlyApprovedLeaves}</p>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-50">
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" defaultValue={user?.email} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition" disabled />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input type="tel" defaultValue={user?.phone || '123-456-7890'} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
              <input type="text" defaultValue="Hair Coloring & Styling" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio</label>
            <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition resize-none" defaultValue="Passionate Master Stylist with 8 years of experience in organic and sustainable beauty treatments. Specialized in balayage and precision cuts."></textarea>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4 mt-8 pt-6">Working Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <div key={day} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                <span className="font-semibold text-gray-700 w-24">{day}</span>
                <div className="flex gap-2 items-center flex-1">
                  <input type="time" defaultValue="09:00" className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-emerald-500 bg-white" />
                  <span className="text-gray-400">-</span>
                  <input type="time" defaultValue="17:00" className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-emerald-500 bg-white" />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-red-50">
              <span className="font-semibold text-red-700 w-24">Saturday</span>
              <span className="font-bold text-red-500 text-sm bg-red-100 px-3 py-1 rounded">Marked as Off</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-red-50">
              <span className="font-semibold text-red-700 w-24">Sunday</span>
              <span className="font-bold text-red-500 text-sm bg-red-100 px-3 py-1 rounded">Marked as Off</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffProfileTab;
