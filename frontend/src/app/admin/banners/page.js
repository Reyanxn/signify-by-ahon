'use client';
import { useState, useEffect } from 'react';
import { bannerAPI, uploadAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [form, setForm] = useState({
    title: '', subtitle: '', description: '', buttonText: 'Shop Now', buttonLink: '/shop',
    desktopImage: { url: '', alt: '' }, mobileImage: { url: '', alt: '' }, position: 0, isActive: true, section: 'hero',
  });

  useEffect(() => {
    bannerAPI.getAllAdmin().then(res => setBanners(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ title: '', subtitle: '', description: '', buttonText: 'Shop Now', buttonLink: '/shop', desktopImage: { url: '', alt: '' }, mobileImage: { url: '', alt: '' }, position: 0, isActive: true, section: 'hero' });
    setEditBanner(null); setShowForm(false);
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await uploadAPI.uploadSingle(formData);
      setForm(prev => ({ ...prev, [type]: { url: data.url, alt: form.title } }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBanner) { await bannerAPI.update(editBanner._id, form); toast.success('Updated'); }
      else { await bannerAPI.create(form); toast.success('Created'); }
      resetForm();
      const res = await bannerAPI.getAllAdmin();
      setBanners(res.data);
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try { await bannerAPI.delete(id); toast.success('Deleted'); setBanners(banners.filter(b => b._id !== id)); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Banners</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm px-4 py-2">Add Banner</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">{editBanner ? 'Edit' : 'New'} Banner</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Title" />
              <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="input-field" placeholder="Subtitle" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Desktop Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'desktopImage')} className="text-xs" />
                  {form.desktopImage?.url && <img src={form.desktopImage.url} alt="" className="w-full h-16 object-cover mt-1" />}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Mobile Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'mobileImage')} className="text-xs" />
                  {form.mobileImage?.url && <img src={form.mobileImage.url} alt="" className="w-full h-16 object-cover mt-1" />}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} className="input-field" placeholder="Button Text" />
                <input value={form.buttonLink} onChange={e => setForm({ ...form, buttonLink: e.target.value })} className="input-field" placeholder="Button Link" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={form.position} onChange={e => setForm({ ...form, position: Number(e.target.value) })} className="input-field" placeholder="Position" />
                <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="input-field">
                  <option value="hero">Hero</option>
                  <option value="promo">Promo</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
              <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-black" /><span>Active</span></label>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm px-4 py-2">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map(banner => (
            <div key={banner._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-[3/1] bg-gray-100 relative">
                {banner.desktopImage?.url && <img src={banner.desktopImage.url} alt={banner.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{banner.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-500">{banner.subtitle} — Position: {banner.position}</p>
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => { setForm({ title: banner.title, subtitle: banner.subtitle || '', description: banner.description || '', buttonText: banner.buttonText, buttonLink: banner.buttonLink, desktopImage: banner.desktopImage, mobileImage: banner.mobileImage, position: banner.position, isActive: banner.isActive, section: banner.section }); setEditBanner(banner); setShowForm(true); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(banner._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
