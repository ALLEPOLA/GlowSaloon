import React, { useEffect, useState } from 'react';
import api from '../../services/authService';

const AdminReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<Array<{
    Id: number;
    CustomerName: string;
    StaffName: string;
    ServiceName: string;
    Rating: number;
    CreatedAt: string;
    Comment?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/admin/reviews');
        if (res.data.success && Array.isArray(res.data.data)) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin reviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    const interval = setInterval(fetchReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/60">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
          </div>
          <span className="ml-3 text-slate-400">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/60">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>⭐</span> Review Moderation
          </h2>
          <p className="text-slate-400 mt-1">Monitor and manage customer feedback across all staff.</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 && (
          <div className="py-12 text-center text-slate-400">No reviews available yet.</div>
        )}
        {reviews.map((review) => (
          <div
            key={review.Id}
            className={`p-6 rounded-xl border ${review.Rating <= 2 ? 'bg-amber-900/20 border-slate-700' : 'bg-slate-900/30 border-slate-700'} transition hover:shadow-md relative group`}
          >
            {review.Rating <= 2 && (
              <span className="absolute top-4 right-4 bg-amber-900/30 text-amber-200 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse border border-slate-700">
                Needs Attention
              </span>
            )}

            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-100 text-lg">{review.CustomerName}</h4>
                  <span className="text-yellow-400 tracking-widest text-lg">
                    {'★'.repeat(review.Rating)}
                    {'☆'.repeat(5 - review.Rating)}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-400 mb-3 flex flex-wrap gap-x-4">
                  <span>📅 {new Date(review.CreatedAt).toLocaleDateString('en-US')}</span>
                  <span className="text-teal-300">🧑‍💼 {review.StaffName}</span>
                  <span className="text-emerald-300">✨ {review.ServiceName}</span>
                </div>
                <p className={`italic ${review.Rating <= 2 ? 'text-amber-200' : 'text-slate-300'}`}>"{review.Comment?.trim() ? review.Comment : 'No comment provided.'}"</p>
              </div>

              <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-4 py-2 bg-slate-900/40 border border-slate-700 text-slate-100 font-semibold rounded-lg text-sm hover:bg-slate-900/60 transition shadow-sm">
                  Reply
                </button>
                <button className="px-4 py-2 bg-slate-900/40 text-amber-200 font-semibold rounded-lg text-sm hover:bg-slate-900/60 transition shadow-sm border border-slate-700">
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviewsTab;
