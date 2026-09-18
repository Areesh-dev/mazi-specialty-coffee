import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import ImageUpload from '../../components/common/ImageUpload';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Loader2, Save, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

const ContentAdmin = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  // State for About/Contact
  const [aboutContent, setAboutContent] = useState({ heading: '', body: '', image_url: '', quote: '' });
  const [contactContent, setContactContent] = useState({ address: '', phone: '', email: '', hours: '', instagram: '', map_url: '' });

  // State for Hero Slider
  const [heroSlides, setHeroSlides] = useState([]);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHeroId, setEditingHeroId] = useState(null);
  const [heroFormData, setHeroFormData] = useState({ eyebrow: '', title: '', description: '', image_url: '', cta_text: '', cta_url: '', display_order: 0, is_active: true });
  const [deleteHeroId, setDeleteHeroId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [heroRes, aboutRes, contactRes] = await Promise.all([
          api.get('/hero?admin=true'),
          api.get('/content/about'),
          api.get('/content/contact')
        ]);
        setHeroSlides(heroRes.data);
        if (aboutRes.data) setAboutContent(aboutRes.data.content);
        if (contactRes.data) setContactContent(contactRes.data.content);
      } catch (err) {
        addToast('Failed to load content', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // --- Hero Slider Handlers ---
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingHeroId) {
        await api.put(`/hero/${editingHeroId}`, heroFormData);
        addToast('Hero slide updated successfully!');
      } else {
        await api.post('/hero', heroFormData);
        addToast('Hero slide created successfully!');
      }
      setIsHeroModalOpen(false);
      resetHeroForm();
      const res = await api.get('/hero?admin=true');
      setHeroSlides(res.data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/hero/${deleteHeroId}`);
      addToast('Hero slide deleted successfully!');
      setDeleteHeroId(null);
      setHeroSlides(heroSlides.filter(s => s.id !== deleteHeroId));
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetHeroForm = () => {
    setEditingHeroId(null);
    setHeroFormData({ eyebrow: '', title: '', description: '', image_url: '', cta_text: '', cta_url: '', display_order: 0, is_active: true });
  };

  const openHeroEdit = (slide) => {
    setEditingHeroId(slide.id);
    setHeroFormData({ 
      eyebrow: slide.eyebrow || '', title: slide.title, description: slide.description || '', 
      image_url: slide.image_url, cta_text: slide.cta_text || '', cta_url: slide.cta_url || '', 
      display_order: slide.display_order, is_active: slide.is_active 
    });
    setIsHeroModalOpen(true);
  };

  // --- About/Contact Handlers ---
  const handleSaveAbout = async () => {
    setIsSaving(true);
    try {
      await api.put('/content/about', { content: aboutContent });
      addToast('About section updated successfully!');
    } catch (err) { addToast(err.message, 'error'); } finally { setIsSaving(false); }
  };

  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
      await api.put('/content/contact', { content: contactContent });
      addToast('Contact information updated successfully!');
    } catch (err) { addToast(err.message, 'error'); } finally { setIsSaving(false); }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Slider' },
    { id: 'about', label: 'About Section' },
    { id: 'contact', label: 'Contact Info' },
  ];

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" size={32} /></div>;

  return (
    <div>
      <h1 className="text-3xl font-heading text-primary mb-8">Website Content</h1>
      
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-primary'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= HERO SLIDER TAB ================= */}
      {activeTab === 'hero' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading">Manage Hero Slides</h2>
            <button onClick={() => { resetHeroForm(); setIsHeroModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition text-sm"><Plus size={16} /> Add Slide</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroSlides.map((slide) => (
              <div key={slide.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="h-40 overflow-hidden relative">
                  <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                  {!slide.is_active && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">Inactive</div>}
                </div>
                <div className="p-4 flex-grow">
                  <p className="text-xs text-accent font-semibold uppercase mb-1">{slide.eyebrow || 'No Eyebrow'}</p>
                  <h3 className="font-heading text-lg text-primary mb-2 line-clamp-1">{slide.title}</h3>
                  <p className="text-xs text-muted mb-3">Order: {slide.display_order}</p>
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={() => openHeroEdit(slide)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                  <button onClick={() => setDeleteHeroId(slide.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ABOUT TAB ================= */}
      {activeTab === 'about' && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
          <h2 className="text-xl font-heading mb-6">Edit About Section</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-semibold mb-1">Heading</label><input type="text" value={aboutContent.heading} onChange={(e) => setAboutContent({...aboutContent, heading: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Body Text</label><textarea rows="5" value={aboutContent.body} onChange={(e) => setAboutContent({...aboutContent, body: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Quote</label><input type="text" value={aboutContent.quote} onChange={(e) => setAboutContent({...aboutContent, quote: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Image</label><ImageUpload onUpload={(url) => setAboutContent({...aboutContent, image_url: url})} bucket="site-assets" folder="about" currentImage={aboutContent.image_url} /></div>
            <button onClick={handleSaveAbout} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded disabled:opacity-50 mt-4"><Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      )}

      {/* ================= CONTACT TAB ================= */}
      {activeTab === 'contact' && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
          <h2 className="text-xl font-heading mb-6">Edit Contact Information</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-semibold mb-1">Address</label><input type="text" value={contactContent.address} onChange={(e) => setContactContent({...contactContent, address: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Phone</label><input type="text" value={contactContent.phone} onChange={(e) => setContactContent({...contactContent, phone: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Email</label><input type="email" value={contactContent.email} onChange={(e) => setContactContent({...contactContent, email: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Opening Hours</label><input type="text" value={contactContent.hours} onChange={(e) => setContactContent({...contactContent, hours: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Instagram URL</label><input type="url" value={contactContent.instagram} onChange={(e) => setContactContent({...contactContent, instagram: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-semibold mb-1">Google Maps Embed URL</label><textarea rows="3" value={contactContent.map_url} onChange={(e) => setContactContent({...contactContent, map_url: e.target.value})} className="w-full p-2 border rounded" /></div>
            <button onClick={handleSaveContact} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded disabled:opacity-50 mt-4"><Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      )}

      {/* ================= HERO MODAL ================= */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-heading text-primary">{editingHeroId ? 'Edit Hero Slide' : 'Add Hero Slide'}</h3>
              <button onClick={() => setIsHeroModalOpen(false)} className="text-muted hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <div><label className="block text-sm font-semibold mb-1">Eyebrow (Optional)</label><input type="text" value={heroFormData.eyebrow} onChange={(e) => setHeroFormData({...heroFormData, eyebrow: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. Our Story" /></div>
              <div><label className="block text-sm font-semibold mb-1">Title *</label><input type="text" required value={heroFormData.title} onChange={(e) => setHeroFormData({...heroFormData, title: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-sm font-semibold mb-1">Description</label><textarea rows="3" value={heroFormData.description} onChange={(e) => setHeroFormData({...heroFormData, description: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-sm font-semibold mb-1">Image *</label><ImageUpload onUpload={(url) => setHeroFormData({...heroFormData, image_url: url})} bucket="hero-images" folder="slides" currentImage={heroFormData.image_url} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1">CTA Text</label><input type="text" value={heroFormData.cta_text} onChange={(e) => setHeroFormData({...heroFormData, cta_text: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. Explore Menu" /></div>
                <div><label className="block text-sm font-semibold mb-1">CTA URL</label><input type="text" value={heroFormData.cta_url} onChange={(e) => setHeroFormData({...heroFormData, cta_url: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. /menu" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1">Display Order</label><input type="number" value={heroFormData.display_order} onChange={(e) => setHeroFormData({...heroFormData, display_order: parseInt(e.target.value)})} className="w-full p-2 border rounded" /></div>
                <div className="flex items-center gap-2 mt-6"><input type="checkbox" id="is_active" checked={heroFormData.is_active} onChange={(e) => setHeroFormData({...heroFormData, is_active: e.target.checked})} className="w-4 h-4" /><label htmlFor="is_active" className="text-sm font-semibold">Active</label></div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsHeroModalOpen(false)} className="px-4 py-2 text-muted">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-white rounded disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteHeroId} onClose={() => setDeleteHeroId(null)} onConfirm={handleHeroDelete} title="Delete Hero Slide" message="Are you sure you want to delete this slide?" isLoading={isDeleting} />
    </div>
  );
};

export default ContentAdmin;