import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/authService';

// Import Staff Components
import StaffTopNav from '../components/staff-dashboard/StaffTopNav';
import StaffSidebar from '../components/staff-dashboard/StaffSidebar';
import StaffWelcomeSection from '../components/staff-dashboard/StaffWelcomeSection';
import StaffStatsCards from '../components/staff-dashboard/StaffStatsCards';
import TodayAppointments from '../components/staff-dashboard/TodayAppointments';
import StaffUpcomingAppointments from '../components/staff-dashboard/StaffUpcomingAppointments';
import StaffServicesTab from '../components/staff-dashboard/StaffServicesTab';
import StaffLeavesTab from '../components/staff-dashboard/StaffLeavesTab';
import StaffProfileTab from '../components/staff-dashboard/StaffProfileTab';
import StaffReviewsTab from '../components/staff-dashboard/StaffReviewsTab';
import StaffNotificationsTab from '../components/staff-dashboard/StaffNotificationsTab';
import StaffRescheduleRequests from '../components/staff-dashboard/StaffRescheduleRequests';

type TabType = 'dashboard' | 'appointments' | 'services' | 'leaves' | 'profile' | 'reviews' | 'notifications';
type StaffNotification = {
  id: number;
  message: string;
  type: string;
  read: boolean;
  createdAt?: string;
};

const StaffDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen] = useState(true);

  const [notifications, setNotifications] = useState<StaffNotification[]>([]);

  useEffect(() => {
    const readMapRaw = localStorage.getItem('staffNotificationReadMap');
    const readMap: Record<string, boolean> = readMapRaw ? JSON.parse(readMapRaw) : {};

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/staff/notifications');
        if (res.data.success && Array.isArray(res.data.data)) {
          const hydrated = res.data.data.map((notif: StaffNotification) => ({
            ...notif,
            read: !!readMap[String(notif.id)],
          }));
          setNotifications(hydrated);
        }
      } catch (error) {
        console.error('Failed to fetch staff notifications', error);
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
    const readMapRaw = localStorage.getItem('staffNotificationReadMap');
    const readMap: Record<string, boolean> = readMapRaw ? JSON.parse(readMapRaw) : {};
    readMap[String(id)] = true;
    localStorage.setItem('staffNotificationReadMap', JSON.stringify(readMap));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Ambient background accents (match StaffLoginPage) */}
      <div className="pointer-events-none absolute top-24 left-10 w-72 h-72 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      <div className="pointer-events-none absolute bottom-24 right-10 w-72 h-72 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      {/* Top Navigation for Staff */}
      <StaffTopNav
        userName={user?.name}
        onLogout={handleLogout}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <StaffSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full relative z-10">

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <StaffWelcomeSection userName={user?.name} />
              <StaffStatsCards />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <TodayAppointments />
                <StaffUpcomingAppointments />
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="animate-fade-in space-y-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-6">Master Appointment List</h2>
              <StaffRescheduleRequests />
              <TodayAppointments />
              <div className="mt-8">
                <StaffUpcomingAppointments />
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="animate-fade-in">
              <StaffServicesTab />
            </div>
          )}

          {/* Leaves Tab */}
          {activeTab === 'leaves' && (
            <div className="animate-fade-in">
              <StaffLeavesTab />
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <StaffReviewsTab />
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <StaffProfileTab user={user ?? undefined} />
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <StaffNotificationsTab notifications={notifications} onMarkAsRead={markAsRead} />
            </div>
          )}

        </main>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default StaffDashboardPage;
