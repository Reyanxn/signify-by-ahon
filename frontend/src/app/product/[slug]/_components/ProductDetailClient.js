'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { productAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailClient({ slug }) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [isStitched, setIsStitched] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getBySlug(slug);
        setProduct(res.data);
        const relatedRes = await productAPI.getAll({ category: res.data.category?._id, limit: 4 });
        setRelated(relatedRes.data.products.filter(p => p._id !== res.data._id));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product._id, selectedSize, isStitched, quantity);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20"><div className="animate-pulse bg-gray-100 h-96" /></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const p = product;
  const hasDiscount = p.salePrice && p.salePrice < p.regularPrice;
  const images = p.images?.length > 0 ? p.images : [{ url: 'https://placehold.co/800x1000/eee/999?text=No+Image' }];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-[4/5] bg-gray-50 mb-4">
            <Image src={images[activeImg]?.url} alt={p.name} fill className="object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-20 border-2 relative ${activeImg === i ? 'border-black' : 'border-transparent'}`}>
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{p.collection || p.category?.name}</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">{p.name}</h1>
          <div className="flex items-center space-x-3 mb-6">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold">{p.salePrice?.toLocaleString()}</span>
                <span className="text-gray-400 line-through text-lg">{p.regularPrice?.toLocaleString()}</span>
                <span className="text-red-500 text-sm font-medium">-{p.discountPercent}%</span>
              </>
            ) : (
              <span className="text-2xl font-bold">{p.regularPrice?.toLocaleString()}</span>
            )}
            <span className="text-gray-500">BDT</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{p.description}</p>

          <div className="space-y-4 mb-8">
            {p.fabric && (
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500">Fabric</span>
                <span className="text-sm font-medium">{p.fabric}</span>
              </div>
            )}
            {p.pieces && (
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500">Pieces</span>
                <span className="text-sm font-medium">{p.pieces}</span>
              </div>
            )}

            {p.isStitchedAvailable && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 w-24">Stitching</span>
                <div className="flex space-x-2">
                  <button onClick={() => setIsStitched(false)} className={`px-4 py-2 text-sm border ${!isStitched ? 'bg-black text-white border-black' : 'hover:bg-gray-50'}`}>Unstitched</button>
                  <button onClick={() => setIsStitched(true)} className={`px-4 py-2 text-sm border ${isStitched ? 'bg-black text-white border-black' : 'hover:bg-gray-50'}`}>Stitched</button>
                </div>
              </div>
            )}

            {p.sizes?.length > 0 && (
              <div>
                <span className="text-sm text-gray-500 block mb-2">Size</span>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((size) => (
                    <button key={size.name} onClick={() => setSelectedSize(size.name)} disabled={!size.inStock} className={`px-4 py-2 text-sm border min-w-[50px] text-center ${!size.inStock ? 'opacity-30 cursor-not-allowed' : selectedSize === size.name ? 'bg-black text-white border-black' : 'hover:bg-gray-50'}`}>
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Qty</span>
              <div className="flex border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-50">-</button>
                <span className="px-4 py-2 text-sm min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-50">+</button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button onClick={handleAddToCart} className="btn-primary flex-1 text-center" disabled={!p.inStock}>
              {p.inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>

          {p.attributes?.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-3 uppercase text-sm tracking-wider">Product Details</h3>
              <div className="space-y-2">
                {p.attributes.map((attr, i) => (
                  <div key={i} className="flex text-sm">
                    <span className="w-32 text-gray-500">{attr.key}</span>
                    <span>{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-display font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
