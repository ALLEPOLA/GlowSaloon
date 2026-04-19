import React, { useEffect, useState } from 'react';
import api from '../../services/authService';

interface Review {
  Id: number;
  ServiceName: string;
  StaffName: string;
  Rating: number;
  Comment: string;
  CreatedAt: string;
}

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/customer/reviews');
        if (res.data.success && Array.isArray(res.data.data)) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load customer reviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">My Reviews</h1>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500 font-semibold">
          Loading reviews...
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
          You have not added any reviews yet.
        </div>
      )}

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.Id} className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{review.ServiceName}</h3>
                <p className="text-gray-600">with {review.StaffName} • {formatDate(review.CreatedAt)}</p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl">
                    {i < review.Rating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.Comment || 'No comment provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
