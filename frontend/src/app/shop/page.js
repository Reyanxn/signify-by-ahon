'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { productAPI, categoryAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const fabrics = ['Lawn', 'Khaddar', 'Viscose', 'Chiffon', 'Velvet', 'Raw Silk', 'Jacquard Khaddar', 'Cambric', 'Net'];
const sortOptions = [
  { value: 'createdAt', label: 'Featured' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

export default function ShopPage() {
  return <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>}><ShopContent /></Suspense>;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    collection: searchParams.get('collection') || '',
    fabric: '',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 20, sort: filters.sort };
        if (filters.collection) params.collection = filters.collection;
        if (filters.fabric) params.fabric = filters.fabric;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        const res = await productAPI.getAll(params);
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchProducts();
  }, [page, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{total} products</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden text-sm uppercase tracking-wider border px-4 py-2">
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="border px-3 py-2 text-sm outline-none">
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 uppercase text-sm tracking-wider">Categories</h3>
              <div className="space-y-2">
                <button onClick={() => setFilters({ ...filters, collection: '' })} className={`block text-sm ${!filters.collection ? 'text-primary-500 font-medium' : 'text-gray-600 hover:text-black'}`}>
                  All
                </button>
                {categories.map((cat) => (
                  <button key={cat._id} onClick={() => setFilters({ ...filters, collection: cat.name })} className={`block text-sm ${filters.collection === cat.name ? 'text-primary-500 font-medium' : 'text-gray-600 hover:text-black'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 uppercase text-sm tracking-wider">Fabric</h3>
              <div className="space-y-2">
                {fabrics.map((f) => (
                  <label key={f} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={filters.fabric === f} onChange={() => setFilters({ ...filters, fabric: filters.fabric === f ? '' : f })} className="accent-black" />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 uppercase text-sm tracking-wider">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="w-full border px-2 py-1.5 text-sm outline-none" />
                <span>-</span>
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="w-full border px-2 py-1.5 text-sm outline-none" />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex justify-center mt-10 space-x-2">
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 text-sm border ${page === i + 1 ? 'bg-black text-white border-black' : 'hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
