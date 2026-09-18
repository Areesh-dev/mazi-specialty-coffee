import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import ImageUpload from '../../components/common/ImageUpload';
import { Loader2, Save, Lock, Palette, Type, Globe } from 'lucide-react';

const SettingsAdmin = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();
  const { setTheme } = useTheme();

  const [general, setGeneral] = useState({ siteName: 'Mazi Specialty Coffee', logoUrl: '' });
  const [themeSettings, setThemeSettings] = useState({ primary: '#4A3B32', secondary: '#7A8B6E', background: '#FDFBF7', surface: '#F4EFE6', text: '#2C2C2C', muted: '#8E8A86', accent: '#C27A5E', border: '#E5E0D8' });
  const [typography, setTypography] = useState({ headingFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif" });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings?admin=true');
        const settingsMap = response.data.reduce((acc, curr) => {
          acc[curr.setting_key] = curr.setting_value;
          return acc;
        }, {});

        if (settingsMap.general) setGeneral(settingsMap.general);
        if (settingsMap.theme) setThemeSettings(settingsMap.theme);
        if (settingsMap.typography) setTypography(settingsMap.typography);
      } catch (err) {
        addToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSetting = async (key, value, isPublic = true) => {
    setIsSaving(true);
    try {
      await api.put(`/settings/${key}`, { value, is_public: isPublic });
      addToast(`${key.charAt(0).toUpperCase() + key.slice(1)} settings updated!`);

      if (key === 'theme') {
        setTheme(prev => ({ ...prev, ...value }));
      }
      if (key === 'typography') {
        setTheme(prev => ({ ...prev, headingFont: value.headingFont, bodyFont: value.bodyFont }));
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return addToast('Passwords do not match.', 'error');
    }
    if (passwords.newPassword.length < 6) {
      return addToast('Password must be at least 6 characters.', 'error');
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (error) throw error;
      addToast('Password updated successfully!');
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'account', label: 'Account', icon: Lock },
  ];

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" size={32} /></div>;

  return (
    <div>
      <h1 className="text-3xl font-heading text-primary mb-8">Settings</h1>

      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-primary'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
          <h2 className="text-xl font-heading mb-6">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Site Name</label>
              <div>
                <label className="block text-sm font-semibold mb-1">Logo</label>
                <ImageUpload
                  onUpload={(url) => setGeneral({ ...general, logoUrl: url })}
                  bucket="site-assets"
                  folder="branding"
                  currentImage={general.logoUrl}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Logo URL</label>
              <input type="url" value={general.logoUrl} onChange={(e) => setGeneral({ ...general, logoUrl: e.target.value })} className="w-full p-2 border rounded" placeholder="https://..." />
            </div>
            <button onClick={() => handleSaveSetting('general', general)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded disabled:opacity-50 mt-4"><Save size={18} /> {isSaving ? 'Saving...' : 'Save General'}</button>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
          <h2 className="text-xl font-heading mb-6">Brand Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.keys(themeSettings).map((key) => (
              <div key={key}>
                <label className="block text-sm font-semibold mb-1 capitalize">{key}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={themeSettings[key]} onChange={(e) => setThemeSettings({ ...themeSettings, [key]: e.target.value })} className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
                  <input type="text" value={themeSettings[key]} onChange={(e) => setThemeSettings({ ...themeSettings, [key]: e.target.value })} className="flex-1 p-2 border rounded font-mono text-sm" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => handleSaveSetting('theme', themeSettings)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded disabled:opacity-50 mt-6"><Save size={18} /> {isSaving ? 'Saving...' : 'Save Theme'}</button>
        </div>
      )}

      {activeTab === 'typography' && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
          <h2 className="text-xl font-heading mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Heading Font</label>
              <select value={typography.headingFont} onChange={(e) => setTypography({ ...typography, headingFont: e.target.value })} className="w-full p-2 border rounded bg-white">
                <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                <option value="'Merriweather', serif">Merriweather (Serif)</option>
                <option value="'Lora', serif">Lora (Serif)</option>
                <option value="'Inter', sans-serif">Inter (Sans-Serif)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Body Font</label>
              <select value={typography.bodyFont} onChange={(e) => setTypography({ ...typography, bodyFont: e.target.value })} className="w-full p-2 border rounded bg-white">
                <option value="'Inter', sans-serif">Inter (Sans-Serif)</option>
                <option value="'Roboto', sans-serif">Roboto (Sans-Serif)</option>
                <option value="'Open Sans', sans-serif">Open Sans (Sans-Serif)</option>
                <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
              </select>
            </div>
            <button onClick={() => handleSaveSetting('typography', typography)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded disabled:opacity-50 mt-4"><Save size={18} /> {isSaving ? 'Saving...' : 'Save Typography'}</button>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
          <h2 className="text-xl font-heading mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">New Password</label>
              <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full p-2 border rounded" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
              <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="w-full p-2 border rounded" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded disabled:opacity-50 mt-4"><Lock size={18} /> {isSaving ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsAdmin;