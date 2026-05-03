import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/authService';

interface StaffProfileData {
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  yearsOfExperience?: number;
  bio?: string;
}

interface StaffProfileTabProps {
  user?: { name: string; email: string; phone?: string; roleId?: number };
}

const StaffProfileTab: React.FC<StaffProfileTabProps> = ({ user }) => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<StaffProfileData>({});
  const [originalData, setOriginalData] = useState<StaffProfileData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leaves
        const leavesRes = await api.get('/staff/leaves');
        if (leavesRes.data.success && Array.isArray(leavesRes.data.data)) {
          setLeaves(leavesRes.data.data);
        }

        // Fetch profile
        const profileRes = await api.get('/staff/profile');
        if (profileRes.data.success) {
          const profile = profileRes.data.profile;
          const data = {
            name: profile.Name,
            email: profile.Email,
            phone: profile.Phone,
            specialization: profile.Specialization,
            yearsOfExperience: profile.YearsOfExperience,
            bio: profile.Bio,
          };
          setProfileData(data);
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const monthlyApprovedLeaves = useMemo(() => {
    const now = new Date();
    return leaves.filter((l) => {
      if (l.Status !== 'Approved') return false;
      const d = new Date(l.LeaveDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [leaves]);

  const getChangedFields = (): Record<string, any> => {
    const changes: Record<string, any> = {};
    
    if (profileData.name !== originalData.name) {
      changes.Name = profileData.name;
    }
    if (profileData.phone !== originalData.phone) {
      changes.Phone = profileData.phone;
    }
    if (profileData.specialization !== originalData.specialization) {
      changes.Specialization = profileData.specialization;
    }
    if (profileData.yearsOfExperience !== originalData.yearsOfExperience) {
      changes.YearsOfExperience = profileData.yearsOfExperience;
    }
    if (profileData.bio !== originalData.bio) {
      changes.Bio = profileData.bio;
    }

    return changes;
  };

  const handleSave = async () => {
    const changes = getChangedFields();
    
    if (Object.keys(changes).length === 0) {
      setMessage('No changes to save');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/staff/profile', changes);
      if (response.data.success) {
        setOriginalData(profileData);
        setIsEditing(false);
        setMessage('✓ Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage('✗ Failed to update profile');
      console.error('Error updating profile:', error);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setMessage('');
  };

  const handleChange = (field: string, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasChanges = Object.keys(getChangedFields()).length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Status Message */}
      {message && (
        <div className="p-4 bg-slate-700 border-2 border-emerald-500 text-slate-100 rounded-lg">
          {message}
        </div>
      )}

      {/* Profile Header Block */}
      <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60">
        <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-emerald-900/30 flex items-center justify-center text-5xl shadow-lg relative group cursor-pointer overflow-hidden">
              <span className="group-hover:opacity-10 transition z-10 block">👩‍💼</span>
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold z-20">
                  Upload Photo
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-20 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-100">{profileData?.name || 'Staff Member'}</h2>
              <p className="text-emerald-600 font-semibold text-lg flex items-center gap-1 mt-1">
                <span>✂️</span> {profileData?.specialization || 'Specialist'}
              </p>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg shadow hover:shadow-lg transition"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  disabled={loading || !hasChanges}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Saving...' : '💾 Save'}
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-6 py-2 border-2 border-emerald-600 text-emerald-400 font-bold rounded-lg hover:bg-emerald-900/20 transition"
                >
                  ✕ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/95 rounded-2xl shadow-2xl p-6 border border-slate-700/60">
        <h3 className="text-xl font-bold text-slate-100 mb-4">Monthly Leave</h3>
        <div className="inline-flex items-center gap-3 px-4 py-3 bg-emerald-900/20 border border-slate-700 rounded-xl">
          <span className="text-2xl">🌴</span>
          <div>
            <p className="text-sm text-slate-400">Approved leaves this month</p>
            <p className="text-2xl font-bold text-emerald-700">{monthlyApprovedLeaves}</p>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <div className="bg-slate-800/95 rounded-2xl shadow-2xl p-8 border border-slate-700/60">
        <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">Personal Information</h3>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
              <input 
                type="text" 
                value={profileData?.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={profileData?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-300 rounded-xl opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
              <input 
                type="tel" 
                value={profileData?.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Specialization</label>
              <input 
                type="text" 
                value={profileData?.specialization || ''}
                onChange={(e) => handleChange('specialization', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Years of Experience</label>
              <input 
                type="number" 
                value={profileData?.yearsOfExperience || ''}
                onChange={(e) => handleChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Professional Bio</label>
            <textarea 
              rows={4} 
              value={profileData?.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none ${
                !isEditing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              placeholder="Tell us about your professional experience and specialties"
            ></textarea>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffProfileTab;
