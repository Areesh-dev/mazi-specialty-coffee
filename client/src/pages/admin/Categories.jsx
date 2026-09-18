import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import ImageUpload from '../../components/common/ImageUpload';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '', is_active: true, display_order: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories?admin=true');
      setCategories(response.data);
    } catch (err) {
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
        addToast('Category updated successfully!');
      } else {
        await api.post('/categories', formData);
        addToast('Category created successfully!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/categories/${deleteId}`);
      addToast('Category deleted successfully!');
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', image_url: '', is_active: true, display_order: 0 });
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '', is_active: cat.is_active, display_order: cat.display_order });
    setIsModalOpen(true);
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-heading text-primary">Categories</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition"><Plus size={18} /> Add Category</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <Search className="text-muted" size={20} />
          <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
        
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" size={32} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-muted font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Order</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">{cat.image_url ? <img src={cat.image_url} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded" />}</td>
                    <td className="p-4 font-medium text-primary">{cat.name}</td>
                    <td className="p-4 text-muted">{cat.display_order}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteId(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded ml-2"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-heading text-primary mb-6">{editingId ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image</label>
                <ImageUpload onUpload={(url) => setFormData({...formData, image_url: url})} bucket="menu-images" folder="categories" currentImage={formData.image_url} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Display Order</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="is_active" className="text-sm font-semibold">Active</label>
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

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Category" message="Are you sure you want to delete this category? This action cannot be undone." isLoading={isDeleting} />
    </div>
  );
};

export default Categories;