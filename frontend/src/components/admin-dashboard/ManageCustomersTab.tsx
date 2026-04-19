import React, { useState, useEffect } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  gender?: string;
  dateOfBirth?: string;
  address?: string;
}

const ManageCustomersTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/admin/customers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setCustomers(result.data);
      } else {
        setError('Failed to load customers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeactivateActivate = async (customerId: number, currentStatus: string) => {
    try {
      const isActive = currentStatus === 'Inactive';
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You are not authenticated. Please log in again.');
        return;
      }

      const response = await fetch(`http://localhost:3000/admin/customers/${customerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer status');
      }

      // Refresh the customer list
      await fetchCustomers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating customer status:', err);
    }
  };

  const handleDelete = async (customerId: number) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You are not authenticated. Please log in again.');
        return;
      }

      const response = await fetch(`http://localhost:3000/admin/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      // Refresh the customer list
      await fetchCustomers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting customer:', err);
    }
  };

  const handleView = (customerId: number) => {
    // TODO: Add view details functionality
    console.log(`View details for customer ${customerId}`);
  };

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/60">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>👥</span> Manage Customers
          </h2>
          <p className="text-slate-400 mt-1">View and manage all registered customer accounts.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/40 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-100 transition"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-slate-900/40 border border-slate-700 rounded-lg">
          <p className="text-amber-200 text-sm">{error}</p>
          <button 
            onClick={fetchCustomers}
            className="mt-2 px-3 py-1 bg-slate-800 text-amber-200 hover:bg-slate-700 rounded-md text-sm font-semibold transition border border-slate-700"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
          </div>
          <span className="ml-3 text-slate-400">Loading customers...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-sm">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/40 text-slate-300 text-sm border-b border-slate-700">
                <th className="px-6 py-4 font-bold">Customer Info</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Join Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-900/30 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900/40 text-teal-200 font-bold flex items-center justify-center shrink-0 border border-slate-700">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-100">{customer.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-200">{customer.email}</p>
                    <p className="text-xs text-slate-400">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{customer.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      customer.status === 'Active' ? 'bg-emerald-900/30 text-emerald-200 border border-slate-700' : 'bg-slate-900/40 text-slate-200 border border-slate-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button 
                      onClick={() => handleView(customer.id)}
                      className="px-3 py-1.5 bg-slate-900/40 text-teal-200 hover:bg-slate-900/60 font-semibold rounded-md text-sm transition border border-slate-700"
                    >
                      View
                    </button>
                    {customer.status === 'Active' ? (
                      <button 
                        onClick={() => handleDeactivateActivate(customer.id, customer.status)}
                        className="px-3 py-1.5 bg-slate-900/40 text-amber-200 hover:bg-slate-900/60 font-semibold rounded-md text-sm transition border border-slate-700"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDeactivateActivate(customer.id, customer.status)}
                        className="px-3 py-1.5 bg-slate-900/40 text-teal-200 hover:bg-slate-900/60 font-semibold rounded-md text-sm transition border border-slate-700"
                      >
                        Activate
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(customer.id)}
                      className="px-3 py-1.5 bg-slate-900/40 text-amber-200 hover:bg-slate-900/60 font-semibold rounded-md text-sm transition border border-slate-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    {customers.length === 0 ? 'No customers found in the system.' : 'No customers found matching your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCustomersTab;
