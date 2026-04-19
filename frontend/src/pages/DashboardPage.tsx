import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopNav from '../components/dashboard/TopNav';
import Sidebar from '../components/dashboard/Sidebar';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import StatsCards from '../components/dashboard/StatsCards';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import BrowseServices from '../components/dashboard/BrowseServices';
import ProfileSection from '../components/dashboard/ProfileSection';
import ReviewsSection from '../components/dashboard/ReviewsSection';
import NotificationsSection from '../components/dashboard/NotificationsSection';
import AppointmentsTab from '../components/dashboard/AppointmentsTab';

type TabType = 'dashboard' | 'appointments' | 'services' | 'profile' | 'reviews' | 'notifications';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Appointment confirmed for tomorrow at 2:00 PM', type: 'confirmation', read: false },
    { id: 2, message: 'Your appointment is tomorrow in 24 hours', type: 'reminder', read: false },
    { id: 3, message: 'Appointment cancelled: Haircut session', type: 'cancellation', read: true },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(Math.max(0, unreadCount - 1));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      {/* Top Navigation */}
      <TopNav
        userName={user?.name}
        onLogout={handleLogout}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <WelcomeSection userName={user?.name} />
              <StatsCards />
              <UpcomingAppointments />
              <RecentAppointments />
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="animate-fade-in">
              <AppointmentsTab />
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="animate-fade-in">
              <BrowseServices />
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <ProfileSection user={user ?? undefined} />
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <ReviewsSection />
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <NotificationsSection notifications={notifications} onMarkAsRead={markAsRead} />
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;

