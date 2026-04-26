import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/authService';

const StaffReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/staff/reviews');
        if (res.data.success && Array.isArray(res.data.data)) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load staff reviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + Number(review.Rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const distribution = useMemo(() => {
    const map: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      const rating = Number(review.Rating || 0);
      if (map[rating] !== undefined) map[rating] += 1;
    });
    return map;
  }, [reviews]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Overall Synthesis */}
      <div className="bg-slate-800/95 rounded-2xl shadow-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 justify-center border border-slate-700">
        <div className="text-center">
          <h2 className="text-5xl font-black text-slate-100">{averageRating.toFixed(1)}</h2>
          <div className="text-yellow-400 text-2xl my-2">
            {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
          </div>
          <p className="text-slate-400 font-medium">Based on {reviews.length} reviews</p>
        </div>
        
        <div className="hidden md:block w-px h-24 bg-slate-700"></div>
        
        <div className="w-full md:w-1/2 space-y-2">
          {[5,4,3,2,1].map(star => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8 font-bold text-slate-300">{star} ★</span>
              <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${reviews.length ? (distribution[star] / reviews.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-100 mb-6">Recent Customer Feedback</h3>
        {loading && (
          <div className="bg-slate-800/95 rounded-xl shadow-md p-6 border border-slate-700 text-center text-slate-400 font-semibold">
            Loading reviews...
          </div>
        )}
        {!loading && reviews.length === 0 && (
          <div className="bg-slate-800/95 rounded-xl shadow-md p-6 border border-slate-700 text-center text-slate-400">
            No reviews available yet.
          </div>
        )}
        {reviews.map(review => (
          <div key={review.Id} className="bg-slate-800/95 rounded-xl shadow-md p-6 border border-slate-700 transition hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-900/30 text-emerald-200 font-bold rounded-full flex items-center justify-center text-xl border border-slate-700">
                  {String(review.CustomerName || '').charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-lg">{review.CustomerName}</h4>
                  <p className="text-emerald-600 text-sm font-medium">{review.ServiceName}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 tracking-widest text-lg">
                  {'★'.repeat(Number(review.Rating || 0))}{'☆'.repeat(5 - Number(review.Rating || 0))}
                </div>
                <span className="text-slate-400 text-xs font-semibold">{formatDate(review.CreatedAt)}</span>
              </div>
            </div>
            <p className="text-slate-300 italic bg-slate-900/40 p-4 rounded-lg border-l-4 border-emerald-500">"{review.Comment || 'No comment provided.'}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffReviewsTab;
