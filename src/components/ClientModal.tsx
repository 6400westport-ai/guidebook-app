import { useState } from 'react';
import { X, Plus, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from './ImageUpload';
import type { Client } from '../types';

interface Props {
  client?: Client;
  onClose: () => void;
}

export function ClientModal({ client, onClose }: Props) {
  const { addClient, updateClient } = useApp();
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(client?.photoUrl ?? null);
  const [form, setForm] = useState({
    firstName: client?.firstName ?? '',
    lastName: client?.lastName ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    notes: client?.notes ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Stable temp ID for new client photo path
  const [tempId] = useState(() => `new-${Date.now()}`);

  const clientId = client?.id ?? tempId;
  const photoPath = `${user?.id}/clients/${clientId}.jpg`;

  const handleSave = async () => {
    if (!form.firstName || !form.lastName) return;
    setSaving(true);
    if (client) {
      await updateClient(client.id, { ...form, photoUrl });
    } else {
      await addClient({ ...form, photoUrl });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">{client ? 'Edit Client' : 'New Client'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <ImageUpload
              currentUrl={photoUrl}
              onUploaded={setPhotoUrl}
              onUploadingChange={setUploading}
              path={photoPath}
              shape="circle"
              size="md"
              placeholder={<User size={20} className="text-brand-300" />}
            />
            <div>
              <p className="text-sm font-medium text-slate-700">Client Photo</p>
              <p className="text-xs text-slate-400 mt-0.5">Click to upload</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'First Name', field: 'firstName' },
              { label: 'Last Name', field: 'lastName' },
              { label: 'Email', field: 'email' },
              { label: 'Phone', field: 'phone' },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
                <input type="text" value={form[field as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Notes / Preferences</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={saving || uploading} className="flex-1 py-2.5 text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2">
            <Plus size={15} />{uploading ? 'Uploading...' : saving ? 'Saving...' : client ? 'Save Changes' : 'Add Client'}
          </button>
        </div>
      </div>
    </div>
  );
}
