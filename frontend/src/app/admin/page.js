'use client';
import { useState, useEffect } from 'react';
import { orderAPI, productAPI, userAPI } from '@/lib/api';
import { HiShoppingBag, HiClipboardList, HiUsers, HiCurrencyDollar } from 'react-icons/hi';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orderRes, productRes, userRes] = await Promise.all([
          orderAPI.getAll(), productAPI.getAll({ limit: 1 }), userAPI.getAll(),
        ]);
        const orders = orderRes.data;
        setRecentOrders(orders.slice(0, 5));
        setStats({
          orders: orders.length,
          products: productRes.data.total || 0,
          users: userRes.data.length,
          revenue: orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.total, 0),
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, icon: HiShoppingBag, color: 'bg-blue-500', href: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: HiClipboardList, color: 'bg-green-500', href: '/admin/orders' },
    { label: 'Total Users', value: stats.users, icon: HiUsers, color: 'bg-purple-500', href: '/admin/users' },
    { label: 'Revenue', value: `${stats.revenue.toLocaleString()} BDT`, icon: HiCurrencyDollar, color: 'bg-primary-500', href: '/admin/orders' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-lg shadow-sm p-6 hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b last:border-0">
                  <td className="py-3">#{order._id.toString().slice(-6)}</td>
                  <td className="py-3">{order.shippingAddress?.fullName || 'Guest'}</td>
                  <td className="py-3">{order.total?.toLocaleString()} BDT</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
