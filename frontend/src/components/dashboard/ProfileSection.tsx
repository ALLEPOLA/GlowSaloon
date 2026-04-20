import React from 'react';

interface UserData {
  name?: string;
  email?: string;
}

interface ProfileSectionProps {
  user?: UserData;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user = { name: 'User', email: 'user@example.com' } }) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-4xl font-bold text-slate-100">My Profile</h1>

      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60">
        {/* Profile Avatar Upload */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white text-6xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 bg-teal-600 text-white p-3 rounded-full hover:bg-teal-500 transition shadow-lg">
              📷
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth</label>
              <input
                type="date"
                className="w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Gender</label>
              <select className="w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none">
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Address</label>
            <textarea
              placeholder="Your address"
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-600 bg-slate-700/50 text-slate-100 rounded-lg focus:border-teal-500 focus:outline-none"
            ></textarea>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition">
              💾 Save Changes
            </button>
            <button className="flex-1 border-2 border-slate-600 text-slate-300 font-bold py-3 rounded-lg hover:bg-slate-700 transition">
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
