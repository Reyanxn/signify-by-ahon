'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authAPI, orderAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (user) {
      setProfile({ name: user.name, email: user.email, phone: '' });
      orderAPI.getAll().then(res => setOrders(res.data)).catch(() => {});
    }
  }, [user, loading, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(profile);
      toast.success('Profile updated');
      setEditing(false);
    } catch { toast.error('Failed to update'); }
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-primary-500">{user.name?.[0]}</span>
            </div>
            <h2 className="text-center font-semibold">{user.name}</h2>
            <p className="text-center text-sm text-gray-500">{user.email}</p>
            <div className="mt-4 space-y-2">
              <Link href="/wishlist" className="block text-sm text-gray-600 hover:text-black">Wishlist</Link>
              <button onClick={logout} className="block text-sm text-red-500 hover:text-red-700">Sign Out</button>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Profile</h2>
              <button onClick={() => setEditing(!editing)} className="text-sm text-primary-500 hover:underline">{editing ? 'Cancel' : 'Edit'}</button>
            </div>
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="input-field" placeholder="Name" />
                <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="input-field" placeholder="Email" />
                <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="input-field" placeholder="Phone" />
                <button type="submit" className="btn-primary text-sm px-4 py-2">Save Changes</button>
              </form>
            ) : (
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500 w-20 inline-block">Name:</span> {user.name}</p>
                <p><span className="text-gray-500 w-20 inline-block">Email:</span> {user.email}</p>
              </div>
            )}
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <Link key={order._id} href={`/account/orders/${order._id}`} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium">#{order._id.toString().slice(-6)}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{order.total?.toLocaleString()} BDT</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
