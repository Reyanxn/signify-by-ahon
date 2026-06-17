'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCart();
  const p = product;
  const hasDiscount = p.salePrice && p.salePrice < p.regularPrice;
  const discountPercent = hasDiscount ? Math.round(((p.regularPrice - p.salePrice) / p.regularPrice) * 100) : 0;
  const imgUrl = p.images?.[0]?.url;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(p._id, null, false, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add');
    }
  };

  return (
    <Link href={`/product/${p.slug}`} className="group">
      <div className="relative bg-gray-50 aspect-[4/5] mb-3 overflow-hidden">
        {imgUrl && !imgError ? (
          <Image src={imgUrl} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">{p.name?.substring(0, 30)}</div>
        )}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 font-medium">-{discountPercent}%</span>
        )}
        {!p.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-black text-white px-4 py-1 text-sm uppercase tracking-wider">Sold Out</span>
          </div>
        )}
        <button onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }} className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
          {wishlisted ? <HiHeart className="text-red-500" size={18} /> : <HiOutlineHeart size={18} />}
        </button>
        {p.inStock && (
          <button onClick={handleAddToCart} className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2.5 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            Add to Cart
          </button>
        )}
      </div>
      <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">{p.collection || p.category?.name}</div>
      <h3 className="font-medium text-sm mb-1 truncate">{p.name}</h3>
      <div className="flex items-center space-x-2">
        {hasDiscount ? (
          <>
            <span className="font-semibold">{p.salePrice?.toLocaleString()}</span>
            <span className="text-gray-400 line-through text-sm">{p.regularPrice?.toLocaleString()}</span>
          </>
        ) : (
          <span className="font-semibold">{p.regularPrice?.toLocaleString()}</span>
        )}
        <span className="text-gray-400 text-xs">BDT</span>
      </div>
    </Link>
  );
}
