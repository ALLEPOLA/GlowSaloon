import React, { useState } from 'react';

const ManageAppointmentsTab: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const appointments = [
    { id: 101, customer: 'Alice Johnson', staff: 'Sarah Jenkins', service: 'Haircut', date: 'Oct 25, 2023', time: '10:00 AM', status: 'Pending' },
    { id: 102, customer: 'Robert Smith', staff: 'Michael Chen', service: 'Massage', date: 'Oct 25, 2023', time: '11:30 AM', status: 'In Progress' },
    { id: 103, customer: 'Maria Garcia', staff: 'Emma Watson', service: 'Coloring', date: 'Oct 26, 2023', time: '02:00 PM', status: 'Confirmed' },
    { id: 104, customer: 'James Wilson', staff: 'Sarah Jenkins', service: 'Styling', date: 'Oct 24, 2023', time: '09:00 AM', status: 'Completed' },
    { id: 105, customer: 'Lucy Brown', staff: 'Michael Chen', service: 'Massage', date: 'Oct 24, 2023', time: '01:00 PM', status: 'Cancelled' },
  ];

  const filteredApps = filter === 'All' ? appointments : appointments.filter(a => a.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-teal-100 text-teal-700';
      case 'Confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/60">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>🗓️</span> Master Appointment Ledger
          </h2>
          <p className="text-slate-400 mt-1">View and manage all salon bookings globally.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 bg-slate-900/40 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-100 font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-sm">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-900/40 text-slate-300 text-sm border-b border-slate-700">
              <th className="px-6 py-4 font-bold">Booking ID</th>
              <th className="px-6 py-4 font-bold">Customer & Staff</th>
              <th className="px-6 py-4 font-bold">Service Details</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {filteredApps.map(app => (
              <tr key={app.id} className="hover:bg-slate-900/30 transition">
                <td className="px-6 py-4 font-black text-slate-500">#{app.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-100">{app.customer}</p>
                  <p className="text-xs text-emerald-600 font-semibold">with {app.staff}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-200">{app.service}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">📅 {app.date} 🕒 {app.time}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="px-3 py-1.5 bg-slate-900/40 border border-slate-700 hover:bg-slate-900/60 text-slate-100 font-semibold rounded-md text-sm transition shadow-sm">Details</button>
                  <button className="px-3 py-1.5 bg-slate-900/40 text-teal-200 hover:bg-slate-900/60 border border-slate-700 font-semibold rounded-md text-sm transition shadow-sm">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAppointmentsTab;
