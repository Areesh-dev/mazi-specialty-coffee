import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import ImageUpload from '../../components/common/ImageUpload';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Search, Loader2, Image as ImageIcon, X } from 'lucide-react';

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', cover_image_url: '', event_date: '', event_time: '', location: '', is_published: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  const { addToast } = useToast();

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events?admin=true');
      setEvents(response.data);
    } catch (err) {
      addToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, event_time: formData.event_time || null, location: formData.location || null };
      if (editingId) {
        await api.put(`/events/${editingId}`, payload);
        addToast('Event updated successfully!');
      } else {
        await api.post('/events', payload);
        addToast('Event created successfully!');
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
      await api.delete(`/events/${deleteId}`);
      addToast('Event deleted successfully!');
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
    setFormData({ title: '', description: '', cover_image_url: '', event_date: '', event_time: '', location: '', is_published: false });
  };

  const openEdit = (event) => {
    setEditingId(event.id);
    setFormData({ 
      title: event.title, 
      description: event.description || '', 
      cover_image_url: event.cover_image_url || '', 
      event_date: event.event_date, 
      event_time: event.event_time || '', 
      location: event.location || '', 
      is_published: event.is_published 
    });
    setIsModalOpen(true);
  };


  const openGallery = async (eventId) => {
    setActiveEventId(eventId);
    setIsGalleryModalOpen(true);
    setIsGalleryLoading(true);
    try {
      const response = await api.get(`/events/${eventId}`);
      setGallery(response.data.gallery || []);
    } catch (err) {
      addToast('Failed to load gallery', 'error');
    } finally {
      setIsGalleryLoading(false);
    }
  };

  const handleGalleryUpload = async (url) => {
    try {
      const response = await api.post(`/events/${activeEventId}/gallery`, { image_url: url });
      setGallery([...gallery, response.data]);
      addToast('Image added to gallery!');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleGalleryDelete = async (galleryId) => {
    try {
      await api.delete(`/events/${activeEventId}/gallery/${galleryId}`);
      setGallery(gallery.filter(img => img.id !== galleryId));
      addToast('Image removed from gallery!');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-heading text-primary">Events</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition"><Plus size={18} /> Add Event</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <Search className="text-muted" size={20} />
          <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
        
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" size={32} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-muted font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4">Cover</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">{event.cover_image_url ? <img src={event.cover_image_url} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded" />}</td>
                    <td className="p-4 font-medium text-primary">{event.title}</td>
                    <td className="p-4 text-muted">{new Date(event.event_date).toLocaleDateString()}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${event.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{event.is_published ? 'Published' : 'Draft'}</span></td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button onClick={() => openGallery(event.id)} className="p-2 text-purple-600 hover:bg-purple-50 rounded" title="Manage Gallery"><ImageIcon size={16} /></button>
                      <button onClick={() => openEdit(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded ml-1"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteId(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded ml-1"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Main Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-heading text-primary mb-6">{editingId ? 'Edit Event' : 'Add Event'}</h3>
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
              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Cover Image</label>
                <ImageUpload onUpload={(url) => setFormData({...formData, cover_image_url: url})} bucket="event-images" folder="covers" currentImage={formData.cover_image_url} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="is_published" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="is_published" className="text-sm font-semibold">Published</label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white rounded disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-heading text-primary">Manage Event Gallery</h3>
              <button onClick={() => setIsGalleryModalOpen(false)} className="text-muted hover:text-red-500"><X size={24} /></button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Upload New Image</label>
              <ImageUpload onUpload={handleGalleryUpload} bucket="event-images" folder="gallery" />
            </div>

            <div className="flex-grow overflow-y-auto border-t border-gray-200 pt-6">
              {isGalleryLoading ? <div className="text-center py-4"><Loader2 className="animate-spin mx-auto text-accent" /></div> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.length === 0 && <p className="text-muted col-span-full text-center py-4">No gallery images yet.</p>}
                  {gallery.map(img => (
                    <div key={img.id} className="relative group">
                      <img src={img.image_url} alt="Gallery" className="w-full h-32 object-cover rounded" />
                      <button onClick={() => handleGalleryDelete(img.id)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Event" message="Are you sure you want to delete this event? This will also delete all gallery images." isLoading={isDeleting} />
    </div>
  );
};

export default EventsAdmin;