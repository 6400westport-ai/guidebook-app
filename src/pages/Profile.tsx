import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { Save, User } from 'lucide-react';
import type { Guide } from '../types';

export function Profile() {
  const { guide, setGuide } = useApp();
  const [form, setForm] = useState<Guide>(guide);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof Guide, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setGuide({ ...form, name: `Capt. ${form.firstName} ${form.lastName}` });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout>
      <Header title="My Profile" />

      <div className="max-w-xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Guide Profile</h2>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-brand-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Profile Photo</p>
              <p className="text-xs text-slate-400 mt-0.5">Photo upload coming soon</p>
            </div>
          </div>

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

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>
    </Layout>
  );
}
