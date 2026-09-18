import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Star, CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react';

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const fetchReviews = async (status) => {
    setLoading(true);
    try {
      const response = await api.get(`/reviews?admin=true&status=${status}`);
      setReviews(response.data);
    } catch (err) {
      addToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(activeTab); }, [activeTab]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/reviews/${id}/status`, { status });
      addToast(`Review ${status.toLowerCase()} successfully!`);
      fetchReviews(activeTab);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/reviews/${deleteId}`);
      addToast('Review deleted successfully!');
      setDeleteId(null);
      fetchReviews(activeTab);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = ['PENDING', 'APPROVED', 'DECLINED'];

  return (
    <div>
      <h1 className="text-3xl font-heading text-primary mb-8">Manage Reviews</h1>
      
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-muted hover:bg-gray-100 border border-gray-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" size={32} /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length === 0 && <p className="text-muted col-span-full text-center py-8">No {activeTab.toLowerCase()} reviews found.</p>}
          {reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-accent" : "text-gray-300"} />)}
                </div>
                <span className="text-xs text-muted">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-muted text-sm flex-grow mb-6">"{review.review_text}"</p>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="font-semibold text-primary text-sm">{review.customer_name}</span>
                <div className="flex gap-2">
                  {activeTab === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusUpdate(review.id, 'APPROVED')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Approve"><CheckCircle size={16} /></button>
                      <button onClick={() => handleStatusUpdate(review.id, 'DECLINED')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Decline"><XCircle size={16} /></button>
                    </>
                  )}
                  <button onClick={() => setDeleteId(review.id)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200" title="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Review" message="Are you sure you want to permanently delete this review?" isLoading={isDeleting} />
    </div>
  );
};

export default ReviewsAdmin;