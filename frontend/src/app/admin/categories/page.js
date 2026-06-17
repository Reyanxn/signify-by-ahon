'use client';
import { useState, useEffect } from 'react';
import { categoryAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', order: 0, isActive: true });

  useEffect(() => {
    categoryAPI.getAllAdmin().then(res => setCategories(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const resetForm = () => { setForm({ name: '', description: '', order: 0, isActive: true }); setEditCat(null); setShowForm(false); };

  const handleEdit = (cat) => { setForm({ name: cat.name, description: cat.description || '', order: cat.order || 0, isActive: cat.isActive }); setEditCat(cat); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCat) { await categoryAPI.update(editCat._id, form); toast.success('Updated'); }
      else { await categoryAPI.create(form); toast.success('Created'); }
      resetForm();
      const res = await categoryAPI.getAllAdmin();
      setCategories(res.data);
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await categoryAPI.delete(id); toast.success('Deleted'); setCategories(categories.filter(c => c._id !== id)); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Categories</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm px-4 py-2">Add Category</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editCat ? 'Edit' : 'New'} Category</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Category Name" required />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" placeholder="Description" rows={2} />
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="input-field" placeholder="Order" />
              <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-black" /><span>Active</span></label>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm px-4 py-2">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Slug</th><th className="p-3 text-left">Order</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3 text-gray-500">/{c.slug}</td>
                  <td className="p-3">{c.order}</td>
                  <td className="p-3">{c.isActive ? <span className="text-green-600">Active</span> : <span className="text-red-600">Inactive</span>}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
