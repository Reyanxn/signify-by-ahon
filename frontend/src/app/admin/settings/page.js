'use client';
import { useState, useEffect } from 'react';
import { settingAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'SIGNIFY BY AHON',
    siteDescription: 'Premium Fashion & Clothing Store',
    currency: 'BDT',
    freeShippingThreshold: 5000,
    shippingCost: 200,
    socialLinks: { facebook: '', instagram: '', youtube: '', tiktok: '', whatsapp: '' },
    contactInfo: { phone: '', email: '', address: '' },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingAPI.get().then(res => setSettings(prev => ({ ...prev, ...res.data }))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingAPI.update(settings);
      toast.success('Settings saved');
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-lg">General</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Site Name</label><input value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Currency Symbol</label><input value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Site Description</label><textarea value={settings.siteDescription} onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} className="input-field" rows={2} /></div>

          <h2 className="font-semibold text-lg pt-4 border-t">Shipping</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Free Shipping Threshold (BDT)</label><input type="number" value={settings.freeShippingThreshold} onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Shipping Cost (BDT)</label><input type="number" value={settings.shippingCost} onChange={e => setSettings({ ...settings, shippingCost: Number(e.target.value) })} className="input-field" /></div>
          </div>

          <h2 className="font-semibold text-lg pt-4 border-t">Contact Info</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">Phone</label><input value={settings.contactInfo?.phone || ''} onChange={e => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: e.target.value } })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><input value={settings.contactInfo?.email || ''} onChange={e => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: e.target.value } })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Address</label><input value={settings.contactInfo?.address || ''} onChange={e => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, address: e.target.value } })} className="input-field" /></div>
          </div>

          <h2 className="font-semibold text-lg pt-4 border-t">Social Links</h2>
          <div className="grid grid-cols-2 gap-4">
            {['facebook', 'instagram', 'youtube', 'tiktok', 'whatsapp'].map(platform => (
              <div key={platform}><label className="block text-sm font-medium mb-1 capitalize">{platform}</label><input value={settings.socialLinks?.[platform] || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [platform]: e.target.value } })} className="input-field" /></div>
            ))}
          </div>

          <button type="submit" className="btn-primary mt-4">Save Settings</button>
        </form>
      </div>
    </div>
  );
}
