import React from 'react';

const PaymentsReportsTab: React.FC = () => {
  const transactions = [
    { id: 'INV-1025', customer: 'Alice Johnson', service: 'Premium Haircut', amount: '$45.00', status: 'Paid', date: 'Oct 25, 2023' },
    { id: 'INV-1024', customer: 'Robert Smith', service: 'Deep Tissue Massage', amount: '$85.00', status: 'Refunded', date: 'Oct 24, 2023' },
    { id: 'INV-1023', customer: 'Maria Garcia', service: 'Organic Coloring', amount: '$120.00', status: 'Paid', date: 'Oct 23, 2023' },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-emerald-100 text-6xl opacity-30">💵</div>
          <p className="text-slate-400 font-bold tracking-wide uppercase text-sm">Today's Revenue</p>
          <h3 className="text-3xl font-black text-slate-100 mt-2">$845.00</h3>
        </div>
        <div className="bg-slate-800/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-teal-100 text-6xl opacity-30">📈</div>
          <p className="text-slate-400 font-bold tracking-wide uppercase text-sm">This Week</p>
          <h3 className="text-3xl font-black text-slate-100 mt-2">$4,250.00</h3>
        </div>
        <div className="bg-slate-800/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-teal-100 text-6xl opacity-30">🏆</div>
          <p className="text-slate-400 font-bold tracking-wide uppercase text-sm">This Month</p>
          <h3 className="text-3xl font-black text-slate-100 mt-2">$42,500.00</h3>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/60">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>💳</span> Recent Transactions
          </h2>
          <button className="px-4 py-2 bg-slate-900/40 hover:bg-slate-900/60 text-slate-100 font-bold rounded-lg shadow-sm transition flex items-center gap-2 text-sm border border-slate-700">
            <span>📥</span> Export PDF
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-sm">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/40 text-slate-300 text-sm border-b border-slate-700">
                <th className="px-6 py-4 font-bold">Invoice</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-900/30 transition">
                  <td className="px-6 py-4 text-sm font-bold text-teal-300">{tx.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-100">{tx.customer}</p>
                    <p className="text-xs text-slate-400">{tx.service}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-200">{tx.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tx.status === 'Paid' ? 'bg-emerald-900/30 text-emerald-200 border border-slate-700' : 'bg-amber-900/30 text-amber-200 border border-slate-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsReportsTab;
