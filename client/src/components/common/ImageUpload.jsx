import { useState, useRef } from 'react';
import { api } from '../../lib/api';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ImageUpload = ({ onUpload, bucket = 'site-assets', folder = 'uploads', currentImage = null }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      addToast('Invalid file type. Only JPEG, PNG, and WEBP are allowed.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('File is too large. Maximum size is 5MB.', 'error');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('folder', folder);

      const response = await api.upload('/upload', formData);
      onUpload(response.data.url);
      addToast('Image uploaded successfully!');
    } catch (err) {
      addToast(err.message || 'Failed to upload image.', 'error');
      setPreview(currentImage); 
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full h-48 rounded overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={clearImage} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"><X size={16} /></button>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-border rounded flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors bg-surface">
          {isUploading ? <Loader2 className="animate-spin text-accent" size={32} /> : <Upload className="text-muted mb-2" size={32} />}
          <span className="text-sm text-muted">{isUploading ? 'Uploading...' : 'Click to upload image'}</span>
          <span className="text-xs text-muted/60 mt-1">JPEG, PNG, WEBP (Max 5MB)</span>
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/webp" className="hidden" />
    </div>
  );
};

export default ImageUpload;