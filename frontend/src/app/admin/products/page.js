'use client';
import { useState, useEffect } from 'react';
import { productAPI, categoryAPI, uploadAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', category: '', collection: '', fabric: '', pieces: '3 Pieces',
    productType: '', regularPrice: '', salePrice: '', inStock: true, quantity: 0,
    sizes: [], isStitchedAvailable: false, featured: false, trending: false, isNewArrival: false,
    images: [], tags: '',
  });

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ limit: 100 }),
      categoryAPI.getAllAdmin(),
    ]).then(([pRes, cRes]) => {
      setProducts(pRes.data.products);
      setCategories(cRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', category: '', collection: '', fabric: '', pieces: '3 Pieces', productType: '', regularPrice: '', salePrice: '', inStock: true, quantity: 0, sizes: [], isStitchedAvailable: false, featured: false, trending: false, isNewArrival: false, images: [], tags: '' });
    setEditProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name, description: product.description || '', category: product.category?._id || product.category || '',
      collection: product.collection || '', fabric: product.fabric || '', pieces: product.pieces || '3 Pieces',
      productType: product.productType || '', regularPrice: product.regularPrice?.toString() || '',
      salePrice: product.salePrice?.toString() || '', inStock: product.inStock, quantity: product.quantity || 0,
      sizes: product.sizes || [], isStitchedAvailable: product.isStitchedAvailable, featured: product.featured,
      trending: product.trending, isNewArrival: product.isNewArrival, images: product.images || [],
      tags: product.tags?.join(', ') || '',
    });
    setEditProduct(product);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const formData = new FormData();
    [...files].forEach(f => formData.append('files', f));
    try {
      const { data } = await uploadAPI.upload(formData);
      setForm(prev => ({ ...prev, images: [...prev.images, ...data.map(d => ({ url: d.url, alt: form.name }))] }));
      toast.success('Images uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form, regularPrice: Number(form.regularPrice), salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        quantity: Number(form.quantity), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editProduct) {
        await productAPI.update(editProduct._id, payload);
        toast.success('Product updated');
      } else {
        await productAPI.create(payload);
        toast.success('Product created');
      }
      resetForm();
      const pRes = await productAPI.getAll({ limit: 100 });
      setProducts(pRes.data.products);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await productAPI.delete(id); toast.success('Deleted'); setProducts(products.filter(p => p._id !== id)); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm px-4 py-2">Add Product</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-auto py-10">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{editProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-black text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">Product Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} /></div>
                <div><label className="block text-sm font-medium mb-1">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field" required>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Collection</label><input value={form.collection} onChange={e => setForm({ ...form, collection: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Fabric</label><input value={form.fabric} onChange={e => setForm({ ...form, fabric: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Pieces</label><select value={form.pieces} onChange={e => setForm({ ...form, pieces: e.target.value })} className="input-field"><option>2 Pieces</option><option>3 Pieces</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Product Type</label><input value={form.productType} onChange={e => setForm({ ...form, productType: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Tags (comma separated)</label><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Regular Price (BDT)</label><input type="number" value={form.regularPrice} onChange={e => setForm({ ...form, regularPrice: e.target.value })} className="input-field" required /></div>
                <div><label className="block text-sm font-medium mb-1">Sale Price (BDT)</label><input type="number" value={form.salePrice} onChange={e => setForm({ ...form, salePrice: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Stock Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="input-field" /></div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="accent-black" /><span>In Stock</span></label>
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isStitchedAvailable} onChange={e => setForm({ ...form, isStitchedAvailable: e.target.checked })} className="accent-black" /><span>Stitching Available</span></label>
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-black" /><span>Featured</span></label>
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.trending} onChange={e => setForm({ ...form, trending: e.target.checked })} className="accent-black" /><span>Trending</span></label>
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isNewArrival} onChange={e => setForm({ ...form, isNewArrival: e.target.checked })} className="accent-black" /><span>New Arrival</span></label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 bg-gray-100">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs">&times;</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="text-sm" />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={resetForm} className="px-6 py-2 border hover:bg-gray-50">Cancel</button>
                <button type="submit" className="btn-primary">{editProduct ? 'Update' : 'Create'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="p-3 text-left font-medium">Name</th><th className="p-3 text-left font-medium">Category</th><th className="p-3 text-left font-medium">Price</th><th className="p-3 text-left font-medium">Stock</th><th className="p-3 text-left font-medium">Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category?.name || '-'}</td>
                  <td className="p-3">{p.salePrice?.toLocaleString() || p.regularPrice?.toLocaleString()} BDT</td>
                  <td className="p-3">{p.inStock ? `${p.quantity}` : 'Sold Out'}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline text-xs">Delete</button>
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
