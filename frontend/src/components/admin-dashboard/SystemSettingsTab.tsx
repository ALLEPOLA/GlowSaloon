import React, { useEffect, useState } from 'react';
import api from '../../services/authService';

type DayHours = { open: string; close: string; isClosed: boolean };
type SettingsForm = {
  salonName: string;
  contactEmail: string;
  address: string;
  phone: string;
  currencyCode: 'LKR';
  currencyLocale: 'en-LK';
  operatingHours: Record<string, DayHours>;
  securityAdmins: {
    enforceStrongPasswords: boolean;
    requireTwoFactorForAdmins: boolean;
    adminSessionTimeoutMinutes: number;
    maxFailedLoginAttempts: number;
  };
  notificationRules: {
    emailBookingAlerts: boolean;
    smsBookingAlerts: boolean;
    staffLeaveAlerts: boolean;
    reviewAlerts: boolean;
    dailySummaryTime: string;
  };
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultForm: SettingsForm = {
  salonName: 'GlowVault Salon & Spa',
  contactEmail: 'hello@glowvault.com',
  address: '123 Eco Boulevard, Green District, NY 10001',
  phone: '+94 11 555 1234',
  currencyCode: 'LKR',
  currencyLocale: 'en-LK',
  operatingHours: {
    Monday: { open: '09:00', close: '18:00', isClosed: false },
    Tuesday: { open: '09:00', close: '18:00', isClosed: false },
    Wednesday: { open: '09:00', close: '18:00', isClosed: false },
    Thursday: { open: '09:00', close: '18:00', isClosed: false },
    Friday: { open: '09:00', close: '18:00', isClosed: false },
    Saturday: { open: '10:00', close: '17:00', isClosed: false },
    Sunday: { open: '10:00', close: '17:00', isClosed: true },
  },
  securityAdmins: {
    enforceStrongPasswords: true,
    requireTwoFactorForAdmins: true,
    adminSessionTimeoutMinutes: 30,
    maxFailedLoginAttempts: 5,
  },
  notificationRules: {
    emailBookingAlerts: true,
    smsBookingAlerts: false,
    staffLeaveAlerts: true,
    reviewAlerts: true,
    dailySummaryTime: '18:00',
  },
};

const inputClassName =
  'w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition';

const sectionCardClassName = 'bg-slate-900/25 border border-slate-700 rounded-xl p-5';

const SystemSettingsTab: React.FC = () => {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/system-settings');
        if (res.data?.success && res.data?.data) {
          const data = res.data.data as SettingsForm;
          setForm({
            ...defaultForm,
            ...data,
            currencyCode: 'LKR',
            currencyLocale: 'en-LK',
            operatingHours: {
              ...defaultForm.operatingHours,
              ...(data.operatingHours || {}),
            },
            securityAdmins: {
              ...defaultForm.securityAdmins,
              ...(data.securityAdmins || {}),
            },
            notificationRules: {
              ...defaultForm.notificationRules,
              ...(data.notificationRules || {}),
            },
          });
        }
      } catch (err) {
        setError('Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateDay = (day: string, partial: Partial<DayHours>) => {
    setForm((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: { ...prev.operatingHours[day], ...partial },
      },
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const payload = {
        ...form,
        currencyCode: 'LKR',
        currencyLocale: 'en-LK',
      };
      const res = await api.put('/admin/system-settings', payload);
      if (res.data?.success && res.data?.data) {
        setForm((prev) => ({
          ...prev,
          ...res.data.data,
          currencyCode: 'LKR',
          currencyLocale: 'en-LK',
        }));
        localStorage.setItem(
          'systemCurrency',
          JSON.stringify({ code: 'LKR', locale: 'en-LK' })
        );
        setMessage('Settings saved successfully');
      } else {
        setError('Failed to save settings');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-2">
        <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-md transition">
          🏢 Salon Details
        </button>
        <button className="w-full text-left px-5 py-4 bg-slate-800/95 text-slate-100 font-bold rounded-xl shadow-sm border border-slate-700 transition">
          ⏰ Operating Hours
        </button>
        <button className="w-full text-left px-5 py-4 bg-slate-800/95 text-slate-100 font-bold rounded-xl shadow-sm border border-slate-700 transition">
          🔐 Security & Admins
        </button>
        <button className="w-full text-left px-5 py-4 bg-slate-800/95 text-slate-100 font-bold rounded-xl shadow-sm border border-slate-700 transition">
          🔔 Notification Rules
        </button>
      </div>

      <div className="md:col-span-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60 space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-700 pb-4">
          System Settings
        </h2>

        {loading ? (
          <p className="text-slate-300">Loading settings...</p>
        ) : (
          <>
            <div className={sectionCardClassName}>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Salon Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Salon Name</label>
                  <input
                    type="text"
                    value={form.salonName}
                    onChange={(e) => setForm((prev) => ({ ...prev, salonName: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Currency</label>
                  <input type="text" value="LKR (Rs.)" disabled className={`${inputClassName} opacity-80`} />
                </div>
              </div>
            </div>

            <div className={sectionCardClassName}>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Operating Hours (Editable by day)</h3>
              <div className="space-y-3">
                {days.map((day) => {
                  const dayHours = form.operatingHours[day];
                  return (
                    <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <label className="font-semibold text-slate-300">{day}</label>
                      <input
                        type="time"
                        value={dayHours.open}
                        disabled={dayHours.isClosed}
                        onChange={(e) => updateDay(day, { open: e.target.value })}
                        className={inputClassName}
                      />
                      <input
                        type="time"
                        value={dayHours.close}
                        disabled={dayHours.isClosed}
                        onChange={(e) => updateDay(day, { close: e.target.value })}
                        className={inputClassName}
                      />
                      <label className="flex items-center gap-2 text-slate-300 font-semibold">
                        <input
                          type="checkbox"
                          checked={dayHours.isClosed}
                          onChange={(e) => updateDay(day, { isClosed: e.target.checked })}
                        />
                        Closed
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={sectionCardClassName}>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Security & Admins</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={form.securityAdmins.enforceStrongPasswords}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        securityAdmins: {
                          ...prev.securityAdmins,
                          enforceStrongPasswords: e.target.checked,
                        },
                      }))
                    }
                  />
                  Enforce strong passwords
                </label>
                <label className="flex items-center gap-2 text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={form.securityAdmins.requireTwoFactorForAdmins}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        securityAdmins: {
                          ...prev.securityAdmins,
                          requireTwoFactorForAdmins: e.target.checked,
                        },
                      }))
                    }
                  />
                  Require 2FA for admins
                </label>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Admin session timeout (minutes)</label>
                  <input
                    type="number"
                    min={5}
                    value={form.securityAdmins.adminSessionTimeoutMinutes}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        securityAdmins: {
                          ...prev.securityAdmins,
                          adminSessionTimeoutMinutes: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Max failed login attempts</label>
                  <input
                    type="number"
                    min={1}
                    value={form.securityAdmins.maxFailedLoginAttempts}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        securityAdmins: {
                          ...prev.securityAdmins,
                          maxFailedLoginAttempts: Number(e.target.value) || 1,
                        },
                      }))
                    }
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            <div className={sectionCardClassName}>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Notification Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={form.notificationRules.emailBookingAlerts}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        notificationRules: {
                          ...prev.notificationRules,
                          emailBookingAlerts: e.target.checked,
                        },
                      }))
                    }
                  />
                  Email booking alerts
                </label>
                <label className="flex items-center gap-2 text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={form.notificationRules.smsBookingAlerts}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        notificationRules: {
                          ...prev.notificationRules,
                          smsBookingAlerts: e.target.checked,
                        },
                      }))
                    }
                  />
                  SMS booking alerts
                </label>
                <label className="flex items-center gap-2 text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={form.notificationRules.staffLeaveAlerts}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        notificationRules: {
                          ...prev.notificationRules,
                          staffLeaveAlerts: e.target.checked,
                        },
                      }))
                    }
                  />
                  Staff leave alerts
                </label>
                <label className="flex items-center gap-2 text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={form.notificationRules.reviewAlerts}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        notificationRules: {
                          ...prev.notificationRules,
                          reviewAlerts: e.target.checked,
                        },
                      }))
                    }
                  />
                  Review alerts
                </label>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Daily summary time</label>
                  <input
                    type="time"
                    value={form.notificationRules.dailySummaryTime}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        notificationRules: {
                          ...prev.notificationRules,
                          dailySummaryTime: e.target.value,
                        },
                      }))
                    }
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {error && <p className="text-red-400 font-semibold">{error}</p>}
        {message && <p className="text-emerald-400 font-semibold">{message}</p>}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            disabled={loading || saving}
            className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsTab;
