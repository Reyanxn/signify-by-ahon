'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function WishlistPage() {
  const { user } = useAuth();
  if (!user) return <div className="max-w-xl mx-auto px-4 py-20 text-center"><p className="text-gray-500 mb-4">Please sign in to view your wishlist</p><Link href="/login" className="btn-primary inline-block">Sign In</Link></div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">My Wishlist</h1>
      <div className="text-center py-20 text-gray-500">
        <p>Your wishlist is empty.</p>
        <Link href="/shop" className="text-black underline text-sm mt-2 inline-block">Browse Products</Link>
      </div>
    </div>
  );
}
