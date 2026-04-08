import { useRef, useState } from 'react';
import { X, Camera, Loader, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import type { Trip, TripReport } from '../types';
import { formatDate } from '../lib/utils';

interface Props {
  trip: Trip;
  existingReport?: TripReport;
  onClose: () => void;
}

export function TripReportModal({ trip, existingReport, onClose }: Props) {
  const { saveReport } = useApp();
  const [notes, setNotes] = useState(existingReport?.notes ?? '');
  const [photoUrls, setPhotoUrls] = useState<string[]>(existingReport?.photoUrls ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop();
      const path = `reports/${trip.id}/${Date.now()}_${i}.${ext}`;

      const { error } = await supabase.storage
        .from('Guidebook')
        .upload(path, file, { upsert: true });

      if (!error) {
        const { data } = supabase.storage.from('Guidebook').getPublicUrl(path);
        newUrls.push(data.publicUrl + `?t=${Date.now()}`);
      } else {
        console.error('Photo upload error:', error.message);
      }
    }

    setPhotoUrls(prev => [...prev, ...newUrls]);
    setUploading(false);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await saveReport(trip.id, notes, photoUrls, existingReport?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Trip Report</h2>
            <p className="text-xs text-slate-400">{formatDate(trip.date)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="What happened out there? Conditions, catches, highlights..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Photos
            </label>

            {/* Thumbnail grid */}
            {photoUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden aspect-square bg-slate-100">
                    <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Photos button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader size={15} className="animate-spin text-brand-500" />
              ) : (
                <Camera size={15} className="text-brand-500" />
              )}
              {uploading ? 'Uploading...' : 'Add Photos'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 py-2.5 text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
