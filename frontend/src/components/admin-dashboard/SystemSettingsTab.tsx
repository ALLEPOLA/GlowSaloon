import React from 'react';

const SystemSettingsTab: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Settings Navigation/Categories */}
      <div className="md:col-span-1 space-y-2">
        <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-md transition">
          🏢 Salon Details
        </button>
        <button className="w-full text-left px-5 py-4 bg-slate-800/95 hover:bg-slate-800 text-slate-100 font-bold rounded-xl shadow-sm border border-slate-700 transition">
          ⏰ Operating Hours
        </button>
        <button className="w-full text-left px-5 py-4 bg-slate-800/95 hover:bg-slate-800 text-slate-100 font-bold rounded-xl shadow-sm border border-slate-700 transition">
          🔐 Security & Admins
        </button>
        <button className="w-full text-left px-5 py-4 bg-slate-800/95 hover:bg-slate-800 text-slate-100 font-bold rounded-xl shadow-sm border border-slate-700 transition">
          🔔 Notification Rules
        </button>
      </div>

      {/* Settings Form Area */}
      <div className="md:col-span-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/60">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">Salon Details Configuration</h2>
        
        <form className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-slate-900/40 rounded-2xl flex items-center justify-center text-4xl border-2 border-dashed border-slate-600 cursor-pointer hover:bg-slate-900/60 transition">
              <span className="opacity-50">📸</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-100 mb-1">Upload Salon Logo</h3>
              <p className="text-xs text-slate-400 mb-3">Recommended size: 512x512px. Transparent PNG.</p>
              <button type="button" className="px-4 py-2 bg-slate-900/40 hover:bg-slate-900/60 text-slate-100 font-semibold rounded-lg text-sm transition border border-slate-700">Browse File</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Salon Name</label>
              <input type="text" defaultValue="GlowVault Salon & Spa" className="w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Contact Email</label>
              <input type="email" defaultValue="hello@glowvault.com" className="w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Primary Location Address</label>
              <input type="text" defaultValue="123 Eco Bouleveard, Green District, NY 10001" className="w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 bg-slate-900/40 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Currency</label>
              <select className="w-full px-4 py-3 bg-slate-900/40 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-semibold text-slate-100">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-700 flex justify-end">
            <button type="button" className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettingsTab;
