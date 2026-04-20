import React, { useState, useEffect } from 'react';
import api from '../../services/authService'; // Use authenticated api instance

interface Service {
  Id: number;
  CategoryId: number;
  Name: string;
  Description: string;
  Price: number;
  DurationMinutes: number;
  ImageUrl: string | null;
  CategoryName: string;
}

interface StaffMember {
  id: number;
  userId: number;
  name: string;
  specialization: string;
  experience: number;
  services: Service[];
}

const BrowseServices: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchStaffServices();
  }, []);

  const fetchStaffServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:3000/public/staff');
      if (!res.ok) throw new Error('Failed to fetch staff services');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStaffList(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (staff: StaffMember, service: Service) => {
    setSelectedStaff(staff);
    setSelectedService(service);
    setAppointmentDate('');
    setAppointmentTime('');
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedStaff(null);
    setSelectedService(null);
  };

  const handleBookAppointment = async () => {
    if (!selectedStaff || !selectedService || !appointmentDate || !appointmentTime) {
      alert("Please select both a date and time.");
      return;
    }

    setIsBooking(true);
    try {
      const payload = {
        staffUserId: selectedStaff.userId,
        serviceId: selectedService.Id,
        appointmentDate,
        appointmentTime,
        totalPrice: selectedService.Price,
        durationMinutes: selectedService.DurationMinutes
      };
      
      const res = await api.post('/customer/appointments', payload);
      
      if (res.data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          closeBookingModal();
        }, 2000);
      } else {
        alert(res.data.message || 'Error booking appointment');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while booking. Make sure you are logged in as a customer.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
     return (
       <div className="flex justify-center items-center h-64">
         <div className="animate-pulse flex flex-col items-center">
           <div className="h-12 w-12 bg-teal-700 rounded-full mb-4"></div>
           <div className="text-slate-400 text-lg font-bold">Loading amazing staff and services...</div>
         </div>
       </div>
     );
  }

  if (error) {
     return <div className="p-12 text-center text-amber-200 text-xl font-bold bg-slate-800 border border-slate-700 rounded-xl">Oops! {error}</div>;
  }

  // Filter staff to those who actually have services assigned
  const staffWithServices = staffList.filter(staff => staff.services && staff.services.length > 0);

  return (
    <div className="space-y-10 relative">
      <div>
        <h1 className="text-4xl font-black text-slate-100 tracking-tight">Book With Our Experts</h1>
        <p className="text-slate-400 mt-2 text-lg">Select a specialist and browse their specific salon services.</p>
      </div>

      {staffWithServices.length === 0 ? (
        <div className="text-center py-16 bg-slate-800 rounded-3xl shadow-sm border border-slate-700">
          <div className="text-6xl mb-4">💇‍♀️</div>
          <h2 className="text-2xl font-bold text-slate-200">No Experts Available Right Now</h2>
          <p className="text-slate-400 mt-2">Please check back later or contact the salon directly.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {staffWithServices.map(staff => (
            <div key={staff.id} className="bg-slate-800/95 rounded-3xl shadow-xl overflow-hidden border border-slate-700">
              {/* Staff Header Section */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                </div>
                
                <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-teal-500 shadow-inner flex items-center justify-center shrink-0 z-10">
                  <span className="text-3xl font-black text-teal-300">
                    {staff.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="text-center md:text-left z-10">
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{staff.name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-emerald-50 font-medium">
                      ✨ {staff.specialization}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-emerald-50 font-medium">
                      🎓 {staff.experience} Years Exp.
                    </span>
                  </div>
                </div>
              </div>

              {/* Staff Services Grid */}
              <div className="p-6 md:p-8 bg-slate-900/30">
                <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <span>Available Services</span>
                  <span className="bg-teal-900/40 text-teal-200 text-xs py-1 px-2.5 rounded-full font-bold border border-slate-700">
                    {staff.services.length}
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.services.map(service => (
                    <div key={service.Id} className="bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl border border-slate-700 overflow-hidden transition-all duration-300 group flex flex-col h-full">
                      {service.ImageUrl && (
                        <div className="h-40 bg-slate-700 overflow-hidden">
                          <img src={service.ImageUrl} alt={service.Name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-auto">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <h4 className="text-lg font-bold text-slate-100 leading-snug">{service.Name}</h4>
                            <span className="shrink-0 bg-teal-900/40 text-teal-200 text-xs px-2 py-1 rounded-md font-bold ring-1 ring-slate-700">
                              {service.CategoryName}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-2 mb-4" title={service.Description}>
                            {service.Description || 'No description available.'}
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-end justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-700 mt-4">
                            <div>
                               <p className="text-xs font-semibold text-teal-300/70 uppercase tracking-wide mb-1">Price</p>
                               <p className="text-2xl font-black text-teal-300">
                                 ${Number(service.Price).toFixed(2)}
                               </p>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-semibold text-teal-300/70 uppercase tracking-wide mb-1">Duration</p>
                               <p className="font-bold text-slate-300 flex items-center justify-end gap-1">
                                 ⏱️ {service.DurationMinutes}m
                               </p>
                            </div>
                          </div>
                          
                          <button 
                            className="w-full relative overflow-hidden bg-slate-900 border-2 border-teal-500 text-teal-300 font-bold py-3 rounded-xl
                            hover:bg-teal-600 hover:text-white transition-all duration-300 transform active:scale-95 group/btn"
                            onClick={() => openBookingModal(staff, service)}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              📅 Book Appointment
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModalOpen && selectedStaff && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-slate-700">
            
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
              <h2 className="text-3xl font-black mb-1">Complete Booking</h2>
              <p className="text-emerald-50 font-medium">Schedule your upcoming session</p>
            </div>
            
            <div className="p-8 space-y-6">
              
              {bookingSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-20 h-20 bg-emerald-900/40 text-emerald-300 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">Booking Confirmed!</h3>
                  <p className="text-slate-400">Your appointment has been successfully scheduled.</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-700">
                    <h3 className="font-bold text-slate-100 text-lg">{selectedService.Name}</h3>
                    <p className="text-slate-400 text-sm mt-1">with <span className="font-bold text-slate-300">{selectedStaff.name}</span></p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">Total</p>
                        <p className="text-xl font-bold text-teal-300">${Number(selectedService.Price).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">Duration</p>
                        <p className="text-lg font-bold text-slate-300">{selectedService.DurationMinutes} min</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Select Date</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Select Time</label>
                      <input 
                        type="time" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={closeBookingModal}
                      className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleBookAppointment}
                      disabled={isBooking || !appointmentDate || !appointmentTime}
                      className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBooking ? 'Processing...' : 'Confirm Book'}
                    </button>
                  </div>
                </>
              )}
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

export default BrowseServices;
