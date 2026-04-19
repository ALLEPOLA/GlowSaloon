import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/authService';

// Import Admin Components
import AdminTopNav from '../components/admin-dashboard/AdminTopNav';
import AdminSidebar from '../components/admin-dashboard/AdminSidebar';
import AdminWelcomeSection from '../components/admin-dashboard/AdminWelcomeSection';
import AdminStatsCards from '../components/admin-dashboard/AdminStatsCards';
import ManageCustomersTab from '../components/admin-dashboard/ManageCustomersTab';
import ManageStaffTab from '../components/admin-dashboard/ManageStaffTab';
import ManageServicesTab from '../components/admin-dashboard/ManageServicesTab';
import ManageCategoriesTab from '../components/admin-dashboard/ManageCategoriesTab';
import ManageAppointmentsTab from '../components/admin-dashboard/ManageAppointmentsTab';
import AdminReviewsTab from '../components/admin-dashboard/AdminReviewsTab';
import PaymentsReportsTab from '../components/admin-dashboard/PaymentsReportsTab';
import SystemSettingsTab from '../components/admin-dashboard/SystemSettingsTab';
import AdminNotificationsTab from '../components/admin-dashboard/AdminNotificationsTab';

type AdminTabType = 'dashboard' | 'customers' | 'staff' | 'services' | 'appointments' | 'categories' | 'reviews' | 'payments' | 'settings' | 'notifications';
type AdminNotification = {
  id: number;
  message: string;
  type: string;
  read: boolean;
  createdAt?: string;
};

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');
  const [sidebarOpen] = useState(true);

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    const readMapRaw = localStorage.getItem('adminNotificationReadMap');
    const readMap: Record<string, boolean> = readMapRaw ? JSON.parse(readMapRaw) : {};

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/admin/notifications');
        if (res.data.success && Array.isArray(res.data.data)) {
          const hydrated = res.data.data.map((notif: AdminNotification) => ({
            ...notif,
            read: !!readMap[String(notif.id)],
          }));
          setNotifications(hydrated);
        }
      } catch (error) {
        console.error('Failed to fetch admin notifications', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const readMapRaw = localStorage.getItem('adminNotificationReadMap');
    const readMap: Record<string, boolean> = readMapRaw ? JSON.parse(readMapRaw) : {};
    readMap[String(id)] = true;
    localStorage.setItem('adminNotificationReadMap', JSON.stringify(readMap));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute top-24 left-10 w-72 h-72 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      <div className="pointer-events-none absolute bottom-24 right-10 w-72 h-72 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      {/* Top Navigation for Admin */}
      <AdminTopNav
        userName={user?.name}
        onLogout={handleLogout}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 w-full overflow-y-auto relative z-10">

          <div className="max-w-7xl mx-auto">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                <AdminWelcomeSection userName={user?.name} />
                <AdminStatsCards />
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div className="animate-fade-in">
                <ManageCustomersTab />
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="animate-fade-in">
                <ManageStaffTab />
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="animate-fade-in">
                <ManageServicesTab />
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="animate-fade-in">
                <ManageCategoriesTab />
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="animate-fade-in">
                <ManageAppointmentsTab />
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in">
                <AdminReviewsTab />
              </div>
            )}

            {/* Payments & Reports Tab */}
            {activeTab === 'payments' && (
              <div className="animate-fade-in">
                <PaymentsReportsTab />
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <SystemSettingsTab />
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="animate-fade-in">
                <AdminNotificationsTab notifications={notifications} onMarkAsRead={markAsRead} />
              </div>
            )}
          </div>

        </main>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
