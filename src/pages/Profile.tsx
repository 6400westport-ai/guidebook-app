import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { ImageUpload } from '../components/ImageUpload';
import { Save, User, LogOut, Building2 } from 'lucide-react';
import type { Guide } from '../types';

export function Profile() {
  const { guide, updateProfile, updatePhotoUrl } = useApp();
  const { user, signOut } = useAuth();
  const [form, setForm] = useState<Guide>(guide ?? {} as Guide);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof Guide, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePhotoUploaded = async (url: string) => {
    await updatePhotoUrl('photoUrl', url);
    setForm(prev => ({ ...prev, photoUrl: url.split('?')[0] }));
  };

  const handleLogoUploaded = async (url: string) => {
    await updatePhotoUrl('logoUrl', url);
    setForm(prev => ({ ...prev, logoUrl: url.split('?')[0] }));
  };

  if (!guide || !user) return null;

  return (
    <Layout>
      <Header title="My Profile" />

      <div className="max-w-xl space-y-6">
        {/* Photos */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Photos</h2>

          <div className="flex gap-6 items-start">
            {/* Profile photo */}
            <div className="flex flex-col items-center gap-2">
              <ImageUpload
                currentUrl={form.photoUrl}
                onUploaded={handlePhotoUploaded}
                path={`${user.id}/profile.jpg`}
                shape="circle"
                size="lg"
                placeholder={<User size={28} className="text-brand-300" />}
              />
              <p className="text-xs text-slate-400">Profile Photo</p>
            </div>

            {/* Business logo */}
            <div className="flex flex-col items-center gap-2">
              <ImageUpload
                currentUrl={form.logoUrl}
                onUploaded={handleLogoUploaded}
                path={`${user.id}/logo.jpg`}
                shape="square"
                size="lg"
                placeholder={<Building2 size={24} className="text-brand-300" />}
              />
              <p className="text-xs text-slate-400">Business Logo</p>
            </div>

            <div className="pt-1">
              <p className="text-xs text-slate-500 leading-relaxed">
                Click either image to upload.<br />
                Your logo appears in the sidebar.<br />
                Drag & drop also works.
              </p>
            </div>
          </div>
        </div>

        {/* Guide details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Guide Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'First Name', field: 'firstName' as keyof Guide },
              { label: 'Last Name', field: 'lastName' as keyof Guide },
              { label: 'Email', field: 'email' as keyof Guide },
              { label: 'Phone', field: 'phone' as keyof Guide },
              { label: 'Business Name', field: 'businessName' as keyof Guide },
              { label: 'Location (City, State)', field: 'location' as keyof Guide },
            ].map(({ label, field }) => (
              <div key={field} className={field === 'businessName' || field === 'location' ? 'col-span-2' : ''}>
                <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
                <input
                  type="text"
                  value={String(form[field] ?? '')}
                  onChange={e => handleChange(field, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-500 block mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => handleChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Weather location */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-1">Weather Location</h2>
          <p className="text-xs text-slate-400 mb-4">Coordinates are used for accurate local forecasts.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={form.latitude}
                onChange={e => handleChange('latitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={form.longitude}
                onChange={e => handleChange('longitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Save size={15} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
}
