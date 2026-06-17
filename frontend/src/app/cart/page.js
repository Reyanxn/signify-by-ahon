'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { HiOutlineTrash } from 'react-icons/hi';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center">Loading cart...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex gap-4 border-b pb-4">
              <div className="w-24 h-32 bg-gray-50 relative flex-shrink-0">
                {item.product?.images?.[0]?.url ? (
                  <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1">
                <Link href={`/product/${item.product?.slug}`} className="font-medium hover:text-primary-500">{item.product?.name || 'Product'}</Link>
                {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                {item.isStitched && <p className="text-sm text-gray-500">Stitched</p>}
                <p className="text-sm font-medium mt-1">{(item.price || 0).toLocaleString()} BDT</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} className="w-8 h-8 border rounded hover:bg-gray-50">-</button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-50">+</button>
              </div>
              <div className="flex items-center">
                <span className="font-semibold min-w-[80px] text-right">{(item.price * item.quantity).toLocaleString()} BDT</span>
              </div>
              <button onClick={() => removeItem(item._id)} className="text-gray-400 hover:text-red-500"><HiOutlineTrash size={20} /></button>
            </div>
          ))}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span className="font-bold">{subtotal.toLocaleString()} BDT</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Free shipping on orders over 5,000 BDT</p>
            <Link href="/checkout" className="btn-primary block text-center mt-6">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}
