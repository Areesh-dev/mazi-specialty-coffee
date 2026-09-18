import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import ImageUpload from '../../components/common/ImageUpload';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

const MenuAdmin = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ category_id: '', name: '', description: '', price: 0, image_url: '', is_featured: false, is_available: true, display_order: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        api.get('/menu?admin=true'),
        api.get('/categories?admin=true')
      ]);
      setItems(menuRes.data);
      setCategories(catRes.data);
    } catch (err) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, price: parseFloat(formData.price) };
      if (editingId) {
        await api.put(`/menu/${editingId}`, payload);
        addToast('Menu item updated successfully!');
      } else {
        await api.post('/menu', payload);
        addToast('Menu item created successfully!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/menu/${deleteId}`);
      addToast('Menu item deleted successfully!');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ category_id: categories[0]?.id || '', name: '', description: '', price: 0, image_url: '', is_featured: false, is_available: true, display_order: 0 });
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({ category_id: item.category_id, name: item.name, description: item.description || '', price: item.price, image_url: item.image_url || '', is_featured: item.is_featured, is_available: item.is_available, display_order: item.display_order });
    setIsModalOpen(true);
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-heading text-primary">Menu Items</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition"><Plus size={18} /> Add Item</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <Search className="text-muted" size={20} />
          <input type="text" placeholder="Search menu..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
        
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" size={32} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-muted font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">{item.image_url ? <img src={item.image_url} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded" />}</td>
                    <td className="p-4 font-medium text-primary">{item.name}</td>
                    <td className="p-4 text-muted">{item.categories?.name}</td>
                    <td className="p-4 text-accent font-semibold">Rs. {item.price}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.is_available ? 'Available' : 'Unavailable'}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded ml-2"><Trash2 size={16} /></button>
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
            <h3 className="text-2xl font-heading text-primary mb-6">{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Category *</label>
                <select required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full p-2 border rounded bg-white">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price (Rs.) *</label>
                <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image</label>
                <ImageUpload onUpload={(url) => setFormData({...formData, image_url: url})} bucket="menu-images" folder="items" currentImage={formData.image_url} />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="is_featured" className="text-sm font-semibold">Featured</label>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="is_available" checked={formData.is_available} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="is_available" className="text-sm font-semibold">Available</label>
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

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Menu Item" message="Are you sure you want to delete this menu item?" isLoading={isDeleting} />
    </div>
  );
};

export default MenuAdmin;