import { useRef, useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Props {
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  path: string; // e.g. "userId/profile.jpg"
  shape?: 'circle' | 'square';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: React.ReactNode;
}

export function ImageUpload({ currentUrl, onUploaded, path, shape = 'circle', size = 'md', placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const ext = file.name.split('.').pop();
    const filePath = path.replace(/\.[^.]+$/, '') + '.' + ext;

    const { error } = await supabase.storage
      .from('Guidebook')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Storage upload error:', error.message, error);
      setPreview(currentUrl); // revert preview on failure
    } else {
      const { data } = supabase.storage.from('Guidebook').getPublicUrl(filePath);
      const url = data.publicUrl + '?t=' + Date.now();
      setPreview(url);
      onUploaded(url);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={cn(
        'relative group cursor-pointer overflow-hidden bg-brand-50 border-2 border-dashed border-brand-200 hover:border-brand-400 transition-colors flex items-center justify-center',
        sizeClasses[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-xl'
      )}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      {preview ? (
        <img src={preview} alt="Upload" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center text-brand-300">
          {placeholder ?? <Upload size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />}
        </div>
      )}

      {/* Overlay on hover */}
      <div className={cn(
        'absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
        shape === 'circle' ? 'rounded-full' : 'rounded-xl'
      )}>
        {uploading ? (
          <Loader size={16} className="text-white animate-spin" />
        ) : (
          <Upload size={16} className="text-white" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
