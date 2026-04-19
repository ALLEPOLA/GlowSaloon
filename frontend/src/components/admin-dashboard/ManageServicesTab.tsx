import React, { useState, useEffect } from 'react';

interface Service {
  Id: number;
  CategoryId: number;
  CategoryName: string;
  Name: string;
  Description: string;
  Price: string | null;
  IsPriceConfirmed: boolean | number;
  DurationMinutes: number;
  ImageUrl: string | null;
  IsActive: boolean | number;
}

const ManageServicesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Price Editing state
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated');
        return;
      }
      const res = await fetch('http://localhost:3000/admin/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setServices(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (id: number) => {
    if (!newPrice || isNaN(Number(newPrice))) {
       alert("Please enter a valid number");
       return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/admin/services/${id}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ price: Number(newPrice) })
      });
      if (!res.ok) throw new Error('Failed to update price');
      
      // Update local state
      setServices(services.map(s => s.Id === id ? { ...s, Price: Number(newPrice).toFixed(2), IsPriceConfirmed: true } : s));
      setEditingPriceId(null);
      setNewPrice('');
    } catch (err) {
       alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const filteredServices = services.filter(s => 
    s.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/60">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>✨</span> Manage Services
          </h2>
          <p className="text-slate-400 mt-1">Configure salon offerings, pricing, and durations.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Filter by category or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/40 text-slate-100 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>
          <button className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition whitespace-nowrap">
            + Add Service
          </button>
        </div>
      </div>

      {error ? (
         <div className="mb-4 text-amber-300">{error}</div>
      ) : loading ? (
         <div className="flex justify-center p-8 text-slate-400">Loading services...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-sm">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/40 text-slate-300 text-sm border-b border-slate-700">
                <th className="px-6 py-4 font-bold">Service Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Pricing/Time</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredServices.map(service => (
                <tr key={service.Id} className="hover:bg-slate-900/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-100">{service.Name}</div>
                    <div className="text-xs text-slate-400 mt-1 truncate max-w-[200px]" title={service.Description}>{service.Description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-900/40 text-slate-300 px-2 py-1 rounded text-xs font-semibold border border-slate-700">{service.CategoryName}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editingPriceId === service.Id ? (
                      <div className="flex items-center gap-2">
                        <input 
                           autoFocus
                           type="number" 
                           value={newPrice} 
                           onChange={(e) => setNewPrice(e.target.value)} 
                           className="w-20 border border-slate-600 bg-slate-900/40 text-slate-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-teal-500" 
                           placeholder="Price" 
                        />
                        <button onClick={() => handlePriceUpdate(service.Id)} className="text-emerald-600 hover:text-emerald-800 font-bold text-sm bg-emerald-50 px-2 py-1 rounded">Save</button>
                        <button onClick={() => setEditingPriceId(null)} className="text-slate-300 hover:text-slate-100 text-sm bg-slate-900/40 px-2 py-1 rounded border border-slate-700">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${service.IsPriceConfirmed && service.Price !== null ? 'text-teal-700' : 'text-orange-500'}`}>
                            {service.Price !== null ? '$' + Number(service.Price).toFixed(2) : 'Not Set'}
                          </span>
                          {(!service.IsPriceConfirmed || service.Price === null) && (
                            <span title="Price needs confirmation" className="text-xs bg-orange-100 text-orange-700 px-1 rounded font-bold cursor-help">!</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{service.DurationMinutes} min</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id={`toggle-s${service.Id}`} defaultChecked={!!service.IsActive} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-400 checked:right-0 checked:border-teal-500 focus:outline-none z-10 transition-all duration-300" />
                      <label htmlFor={`toggle-s${service.Id}`} className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-600 cursor-pointer"></label>
                    </div>
                    <span className="ml-2 text-xs font-semibold text-slate-400">{service.IsActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button 
                      onClick={() => {
                        setEditingPriceId(service.Id);
                        setNewPrice(service.Price ? String(service.Price) : '');
                      }} 
                    className={`px-3 py-1.5 font-semibold rounded-md text-sm transition ${(!service.IsPriceConfirmed || service.Price === null) ? 'bg-amber-900/30 text-amber-200 hover:bg-amber-900/50 border border-slate-700' : 'bg-slate-900/40 text-teal-200 hover:bg-slate-900/60 border border-slate-700'}`}
                    >
                      {(!service.IsPriceConfirmed || service.Price === null) ? 'Set Price' : 'Edit Price'}
                    </button>
                    <button className="px-3 py-1.5 bg-slate-900/40 text-amber-200 hover:bg-slate-900/60 font-semibold rounded-md text-sm transition border border-slate-700">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No services found.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .toggle-checkbox:checked { right: 0; border-color: #14b8a6; }
        .toggle-checkbox:checked + .toggle-label { background-color: #5eead4; }
        .toggle-checkbox { right: 20px; z-index: 10; margin: 0; }
        .toggle-label { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default ManageServicesTab;
