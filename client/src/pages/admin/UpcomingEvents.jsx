import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import ImageUpload from '../../components/common/ImageUpload';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Search, Loader2, Star } from 'lucide-react';

const UpcomingEventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', poster_url: '', event_date: '', event_time: '', location: '', booking_url: '', is_featured: false, is_published: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const fetchEvents = async () => {
    try {
      const response = await api.get('/upcoming-events?admin=true');
      setEvents(response.data);
    } catch (err) {
      addToast('Failed to load upcoming events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, event_time: formData.event_time || null, location: formData.location || null, booking_url: formData.booking_url || null };
      if (editingId) {
        await api.put(`/upcoming-events/${editingId}`, payload);
        addToast('Upcoming event updated successfully!');
      } else {
        await api.post('/upcoming-events', payload);
        addToast('Upcoming event created successfully!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/upcoming-events/${deleteId}`);
      addToast('Upcoming event deleted successfully!');
      setDeleteId(null);
      fetchEvents();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', poster_url: '', event_date: '', event_time: '', location: '', booking_url: '', is_featured: false, is_published: false });
  };

  const openEdit = (event) => {
    setEditingId(event.id);
    setFormData({ 
      title: event.title, 
      description: event.description || '', 
      poster_url: event.poster_url || '', 
      event_date: event.event_date, 
      event_time: event.event_time || '', 
      location: event.location || '', 
      booking_url: event.booking_url || '', 
      is_featured: event.is_featured, 
      is_published: event.is_published 
    });
    setIsModalOpen(true);
  };

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-heading text-primary">Upcoming Events</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition"><Plus size={18} /> Add Upcoming Event</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <Search className="text-muted" size={20} />
          <input type="text" placeholder="Search upcoming events..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
        
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" size={32} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-muted font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4">Poster</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => {
                  const isPast = new Date(event.event_date) < new Date();
                  return (
                  <tr key={event.id} className={`border-b border-gray-100 hover:bg-gray-50 ${isPast ? 'opacity-50' : ''}`}>
                    <td className="p-4">{event.poster_url ? <img src={event.poster_url} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded" />}</td>
                    <td className="p-4 font-medium text-primary">{event.title} {isPast && <span className="text-xs text-red-500 block">(Expired)</span>}</td>
                    <td className="p-4 text-muted">{new Date(event.event_date).toLocaleDateString()}</td>
                    <td className="p-4">{event.is_featured ? <Star size={18} className="text-accent fill-accent" /> : <Star size={18} className="text-gray-300" />}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${event.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{event.is_published ? 'Published' : 'Draft'}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteId(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded ml-2"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-heading text-primary mb-6">{editingId ? 'Edit Upcoming Event' : 'Add Upcoming Event'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Date *</label>
                  <input type="date" required value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Time</label>
                  <input type="text" value={formData.event_time} onChange={(e) => setFormData({...formData, event_time: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. 7:00 PM" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Booking URL</label>
                  <input type="url" value={formData.booking_url} onChange={(e) => setFormData({...formData, booking_url: e.target.value})} className="w-full p-2 border rounded" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Poster Image</label>
                <ImageUpload onUpload={(url) => setFormData({...formData, poster_url: url})} bucket="event-images" folder="posters" currentImage={formData.poster_url} />
              </div>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="is_featured" className="text-sm font-semibold">Featured</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_published" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="is_published" className="text-sm font-semibold">Published</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white rounded disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Upcoming Event" message="Are you sure you want to delete this upcoming event?" isLoading={isDeleting} />
    </div>
  );
};

export default UpcomingEventsAdmin;