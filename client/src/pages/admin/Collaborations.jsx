import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import ImageUpload from '../../components/common/ImageUpload';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

const CollaborationsAdmin = () => {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', partner_name: '', description: '', image_url: '', event_date: '', external_url: '', is_published: false, display_order: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const fetchCollabs = async () => {
    try {
      const response = await api.get('/collaborations?admin=true');
      setCollabs(response.data);
    } catch (err) {
      addToast('Failed to load collaborations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollabs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, event_date: formData.event_date || null };
      if (editingId) {
        await api.put(`/collaborations/${editingId}`, payload);
        addToast('Collaboration updated successfully!');
      } else {
        await api.post('/collaborations', payload);
        addToast('Collaboration created successfully!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchCollabs();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/collaborations/${deleteId}`);
      addToast('Collaboration deleted successfully!');
      setDeleteId(null);
      fetchCollabs();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', partner_name: '', description: '', image_url: '', event_date: '', external_url: '', is_published: false, display_order: 0 });
  };

  const openEdit = (collab) => {
    setEditingId(collab.id);
    setFormData({ 
      title: collab.title, 
      partner_name: collab.partner_name, 
      description: collab.description || '', 
      image_url: collab.image_url || '', 
      event_date: collab.event_date || '', 
      external_url: collab.external_url || '', 
      is_published: collab.is_published, 
      display_order: collab.display_order 
    });
    setIsModalOpen(true);
  };

  const filtered = collabs.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.partner_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-heading text-primary">Collaborations</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition"><Plus size={18} /> Add Collaboration</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <Search className="text-muted" size={20} />
          <input type="text" placeholder="Search collaborations..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
        
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" size={32} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-muted font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Title / Partner</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((collab) => (
                  <tr key={collab.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">{collab.image_url ? <img src={collab.image_url} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded" />}</td>
                    <td className="p-4"><span className="font-medium text-primary block">{collab.title}</span><span className="text-muted text-xs">with {collab.partner_name}</span></td>
                    <td className="p-4 text-muted">{collab.event_date ? new Date(collab.event_date).toLocaleDateString() : '-'}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${collab.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{collab.is_published ? 'Published' : 'Draft'}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(collab)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteId(collab.id)} className="p-2 text-red-600 hover:bg-red-50 rounded ml-2"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-heading text-primary mb-6">{editingId ? 'Edit Collaboration' : 'Add Collaboration'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Partner Name *</label>
                <input type="text" required value={formData.partner_name} onChange={(e) => setFormData({...formData, partner_name: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Event Date</label>
                  <input type="date" value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Display Order</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">External URL</label>
                <input type="url" value={formData.external_url} onChange={(e) => setFormData({...formData, external_url: e.target.value})} className="w-full p-2 border rounded" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image</label>
                <ImageUpload onUpload={(url) => setFormData({...formData, image_url: url})} bucket="collaboration-images" folder="partners" currentImage={formData.image_url} />
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

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Collaboration" message="Are you sure you want to delete this collaboration?" isLoading={isDeleting} />
    </div>
  );
};

export default CollaborationsAdmin;