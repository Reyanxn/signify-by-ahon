'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { HiOutlineMenu, HiOutlineX, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineUser, HiOutlineSearch } from 'react-icons/hi';

const navLinks = [
  { name: 'New Arrivals', href: '/shop?collection=new-arrivals' },
  { name: 'Formals', href: '/shop?collection=formals' },
  { name: 'Unstitched Summer', href: '/shop?collection=unstitched-summer' },
  { name: 'Ready to Wear', href: '/shop?collection=ready-to-wear' },
  { name: 'Semi Formals', href: '/shop?collection=semi-formals' },
  { name: 'Special Prices', href: '/shop?collection=special-prices' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <>
      <div className="bg-black text-white text-center text-xs py-2 tracking-widest uppercase">
        Free Shipping Nationwide
      </div>
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
            </button>
            <Link href="/" className="font-display text-xl md:text-2xl font-bold tracking-wide">
              SIGNIFY <span className="text-primary-500">BY AHON</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-sm uppercase tracking-wider hover:text-primary-500 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setSearchOpen(!searchOpen)}><HiOutlineSearch size={20} /></button>
              <Link href="/wishlist"><HiOutlineHeart size={20} /></Link>
              {user ? (
                <div className="relative group">
                  <button><HiOutlineUser size={20} /></button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-50">My Account</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">My Orders</Link>
                    {isAdmin && <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-50 text-primary-500 font-medium">Admin Panel</Link>}
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-t">Sign Out</button>
                  </div>
                </div>
              ) : (
                <Link href="/login"><HiOutlineUser size={20} /></Link>
              )}
              <Link href="/cart" className="relative">
                <HiOutlineShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="block text-sm uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        {searchOpen && (
          <div className="border-t bg-white py-4">
            <div className="max-w-3xl mx-auto px-4">
              <input type="text" placeholder="Search products..." className="w-full border-b-2 border-black pb-2 outline-none text-lg bg-transparent" autoFocus />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
