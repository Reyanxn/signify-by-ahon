'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { HiChartBar, HiShoppingBag, HiCollection, HiClipboardList, HiPhotograph, HiUsers, HiCog } from 'react-icons/hi';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: HiChartBar },
  { name: 'Products', href: '/admin/products', icon: HiShoppingBag },
  { name: 'Categories', href: '/admin/categories', icon: HiCollection },
  { name: 'Orders', href: '/admin/orders', icon: HiClipboardList },
  { name: 'Banners', href: '/admin/banners', icon: HiPhotograph },
  { name: 'Users', href: '/admin/users', icon: HiUsers },
  { name: 'Settings', href: '/admin/settings', icon: HiCog },
];

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-black text-white flex-shrink-0 hidden md:block">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="font-display text-lg font-bold">SIGNIFY BY AHON</Link>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded transition-colors">
              <link.icon size={18} />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-800">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back to Store</Link>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
