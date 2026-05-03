import React, { useState, useEffect } from 'react';
import api from '../../services/authService';

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

interface ProfileSectionProps {
  user?: UserData;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user = { name: 'User', email: 'user@example.com' } }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<UserData>(user);
  const [originalData, setOriginalData] = useState<UserData>(user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/customer/profile');
        if (response.data.success) {
          const profile = response.data.profile;
          const data = {
            name: profile.Name,
            email: profile.Email,
            phone: profile.Phone,
            dateOfBirth: profile.DateOfBirth,
            gender: profile.Gender,
            address: profile.Address,
          };
          setProfileData(data);
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const getChangedFields = (): Record<string, any> => {
    const changes: Record<string, any> = {};
    
    if (profileData.name !== originalData.name) {
      changes.Name = profileData.name;
    }
    if (profileData.phone !== originalData.phone) {
      changes.Phone = profileData.phone;
    }
    if (profileData.dateOfBirth !== originalData.dateOfBirth) {
      changes.DateOfBirth = profileData.dateOfBirth;
    }
    if (profileData.gender !== originalData.gender) {
      changes.Gender = profileData.gender;
    }
    if (profileData.address !== originalData.address) {
      changes.Address = profileData.address;
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
      const response = await api.put('/customer/profile', changes);
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

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasChanges = Object.keys(getChangedFields()).length > 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-100">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition font-semibold"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className="p-4 bg-slate-700 border-2 border-teal-500 text-slate-100 rounded-lg">
          {message}
        </div>
      )}

      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60">
        {/* Profile Avatar Upload */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white text-6xl font-bold">
              {profileData?.name?.charAt(0).toUpperCase()}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-teal-600 text-white p-3 rounded-full hover:bg-teal-500 transition shadow-lg">
                📷
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={profileData?.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={profileData?.email || ''}
                disabled
                className="w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-300 rounded-lg opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData?.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="Phone number"
                className={`w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth</label>
              <input
                type="date"
                value={profileData?.dateOfBirth || ''}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Gender</label>
              <select 
                value={profileData?.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Address</label>
            <textarea
              value={profileData?.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="Your address"
              rows={3}
              className={`w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none ${
                !isEditing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            ></textarea>
          </div>
          
          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleSave}
                disabled={loading || !hasChanges}
                className={`flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
              <button 
                onClick={handleCancel}
                className="flex-1 border-2 border-slate-600 text-slate-300 font-bold py-3 rounded-lg hover:bg-slate-700 transition"
              >
                ✕ Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
