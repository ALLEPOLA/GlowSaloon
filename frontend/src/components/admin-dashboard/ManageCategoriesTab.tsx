import React, { useState, useEffect } from 'react';

interface Category {
  Id: number;
  CategoryName: string;
  Description: string | null;
  IsActive: boolean | number;
  ServiceCount: number;
}

const ManageCategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated');
        return;
      }
      const res = await fetch('http://localhost:3000/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ categoryName: newCatName.trim() })
      });
      if (!res.ok) throw new Error('Failed to add category');
      
      setNewCatName('');
      await fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/60">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <span>🗂️</span> Manage Categories
            </h2>
            <p className="text-slate-400 mt-1">Organize your services into clean categories.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="New category name..." 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full md:w-64 px-4 py-2 bg-slate-900/40 text-slate-100 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button 
              onClick={handleAddCategory}
              className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow hover:shadow-lg transition whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </div>

        {error ? (
           <div className="mb-4 text-amber-300">{error}</div>
        ) : loading ? (
           <div className="flex justify-center p-8 text-slate-400">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div key={cat.Id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-700 hover:border-teal-500/40 transition group">
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">{cat.CategoryName}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{cat.ServiceCount} Active Services</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-teal-200 bg-slate-900/40 shadow-sm rounded-lg hover:bg-slate-900/60 transition border border-slate-700" title="Edit">✏️</button>
                  <button className="p-2 text-amber-200 bg-slate-900/40 shadow-sm rounded-lg hover:bg-slate-900/60 transition border border-slate-700" title="Delete">🗑️</button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400">No categories found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategoriesTab;
