import React, { useState, useEffect } from 'react';
import api from '../../services/authService';
import { formatCurrency } from '../../utils/currency';

interface Service {
  Id: number;
  CategoryId: number;
  Name: string;
  Description: string;
  Price: number;
  DurationMinutes: number;
  ImageUrl: string;
  CategoryName: string;
}

const StaffServicesTab: React.FC = () => {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [myServiceIds, setMyServiceIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInModal, setSelectedInModal] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all public active services
      const servicesRes = await api.get('/services');
      if (servicesRes.data && servicesRes.data.success) {
        setAllServices(servicesRes.data.data);
      }

      // Fetch this staff's services
      const myServicesRes = await api.get('/staff/services');
      if (myServicesRes.data && myServicesRes.data.success) {
        let parsed = myServicesRes.data.data;
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch (e) { parsed = []; }
        }
        setMyServiceIds(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const myServices = allServices.filter(s => myServiceIds.includes(s.Id));

  const handleOpenModal = () => {
    setSelectedInModal([...myServiceIds]);
    setIsModalOpen(true);
  };

  const handleToggleSelection = (id: number) => {
    setSelectedInModal(prev => 
      prev.includes(id) ? prev.filter(serviceId => serviceId !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/staff/services', { serviceIds: selectedInModal });
      if (res.data.success) {
        setMyServiceIds(selectedInModal);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving services:', error);
      alert('Failed to save services. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (id: number) => {
    const newServiceIds = myServiceIds.filter(serviceId => serviceId !== id);
    try {
      const res = await api.put('/staff/services', { serviceIds: newServiceIds });
      if (res.data.success) {
        setMyServiceIds(newServiceIds);
      }
    } catch (error) {
      console.error('Error removing service:', error);
      alert('Failed to remove service.');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400 font-medium">Loading your services...</div>;
  }

  return (
    <div className="bg-slate-800/95 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 border border-slate-700/60">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">My Services</h2>
          <p className="text-slate-400 mt-1">Manage the services you are certified to provide.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          + Add Service
        </button>
      </div>

      {myServices.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-700">
          <div className="text-slate-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-200">No services added yet</h3>
          <p className="text-slate-400 mt-1">Click "+ Add Service" to select the services you offer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myServices.map(service => (
            <div key={service.Id} className="border border-slate-700 bg-slate-900/30 rounded-2xl p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-100 leading-tight">
                  {service.Name}
                </h3>
                <span className="px-2.5 py-1 bg-emerald-900/30 text-emerald-200 text-xs font-bold rounded-md border border-slate-700">
                  Active
                </span>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Duration
                  </span>
                  <span className="text-slate-200 font-bold bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">{service.DurationMinutes} min</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Price
                  </span>
                  <span className="text-emerald-600 font-black text-base">{formatCurrency(Number(service.Price))}</span>
                </div>
                {service.CategoryName && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Category</span>
                    <span className="text-slate-300 font-semibold">{service.CategoryName}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => handleRemove(service.Id)}
                  className="w-full text-sm font-bold text-red-300 bg-red-900/20 hover:bg-red-700 hover:text-white py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Remove Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding services */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in-up border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-2xl font-bold text-slate-100">Available Services</h3>
                <p className="text-slate-400 text-sm mt-1">Select the services you want to add to your profile.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-2 rounded-full transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allServices.map(service => (
                  <div 
                    key={service.Id} 
                    onClick={() => handleToggleSelection(service.Id)}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex items-center gap-4 ${
                      selectedInModal.includes(service.Id) 
                        ? 'border-emerald-500 bg-emerald-900/20 shadow-md shadow-emerald-950/30' 
                        : 'border-slate-700 bg-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      selectedInModal.includes(service.Id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 bg-slate-700'
                    }`}>
                      {selectedInModal.includes(service.Id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-100 truncate">{service.Name}</h4>
                      <p className="text-sm text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-300">{service.DurationMinutes}m</span>
                        <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                        <span className="text-emerald-600 font-bold">{formatCurrency(Number(service.Price))}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {allServices.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  No services found in the centralized database.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-700 bg-slate-800 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-slate-700 transition"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isSaving}
                className="px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </>
                ) : 'Confirm Services'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default StaffServicesTab;
