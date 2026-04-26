import React, { useState, useEffect } from 'react';

const AdminStatsCards: React.FC = () => {
  const [totalCustomers, setTotalCustomers] = useState('0');
  const [totalStaff, setTotalStaff] = useState('0');
  const [todayAppointments, setTodayAppointments] = useState('0');
  const [monthlyAppointments, setMonthlyAppointments] = useState('0');
  const [pendingAppointments, setPendingAppointments] = useState('0');
  const [monthlyRevenue, setMonthlyRevenue] = useState('Rs. 0.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const [customerRes, staffRes, appointmentsRes, settingsRes] = await Promise.all([
        fetch('http://localhost:3000/admin/stats/customers-count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('http://localhost:3000/admin/stats/staff-count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('http://localhost:3000/admin/stats/appointments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('http://localhost:3000/admin/system-settings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      let currencyCode = 'LKR';
      let currencyLocale = 'en-LK';
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.data) {
          currencyCode = settingsData.data.currencyCode || 'LKR';
          currencyLocale = settingsData.data.currencyLocale || 'en-LK';
          localStorage.setItem(
            'systemCurrency',
            JSON.stringify({ code: currencyCode, locale: currencyLocale })
          );
        }
      }

      if (customerRes.ok) {
        const customerData = await customerRes.json();
        if (customerData.success) {
          setTotalCustomers(customerData.data.totalCustomers.toLocaleString());
        }
      }

      if (staffRes.ok) {
        const staffData = await staffRes.json();
        if (staffData.success) {
          setTotalStaff(staffData.data.totalStaff.toLocaleString());
        }
      }

      if (appointmentsRes.ok) {
        const appData = await appointmentsRes.json();
        if (appData.success && appData.data) {
          setTodayAppointments(Number(appData.data.todayAppointments || 0).toLocaleString());
          setMonthlyAppointments(Number(appData.data.monthlyAppointments || 0).toLocaleString());
          setPendingAppointments(Number(appData.data.pendingAppointments || 0).toLocaleString());
          const revenue = Number(appData.data.monthlyRevenue || 0);
          setMonthlyRevenue(
            revenue.toLocaleString(currencyLocale, {
              style: 'currency',
              currency: currencyCode,
              maximumFractionDigits: 2,
            })
          );
        }
      }
    } catch (err) {
      console.error('Error fetching counts:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: "Total Customers", 
      value: loading ? "Loading..." : totalCustomers, 
      change: "+12 this week", 
      icon: "👥",
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Total Staff", 
      value: loading ? "Loading..." : totalStaff, 
      change: "Active staff members", 
      icon: "👔",
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Today's Appointments", 
      value: loading ? "Loading..." : todayAppointments, 
      change: "Today", 
      icon: "📅",
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Monthly Appointments", 
      value: loading ? "Loading..." : monthlyAppointments, 
      change: "This month", 
      icon: "📈",
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Monthly Revenue", 
      value: loading ? "Loading..." : monthlyRevenue, 
      change: "Completed only", 
      icon: "💰",
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Pending Appointments", 
      value: loading ? "Loading..." : pendingAppointments, 
      change: "Requires attention", 
      icon: "⏳",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl p-6 relative overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl border border-slate-700/60 flex flex-col justify-between h-full">
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full pointer-events-none`}></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.title}</p>
              <span className="text-3xl filter drop-shadow-sm">{stat.icon}</span>
            </div>
            <h3 className="text-4xl font-black text-slate-100 tracking-tight">{stat.value}</h3>
          </div>
          <div className="mt-4 relative z-10">
            <span className="text-sm font-semibold bg-slate-900/40 text-slate-300 px-3 py-1 rounded-full border border-slate-700 block w-fit">
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
