'use client';
import { useState, useEffect } from 'react';
import { orderAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    orderAPI.getAll().then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status, trackingNumber) => {
    try {
      await orderAPI.updateStatus(id, { status, trackingNumber });
      toast.success('Order updated');
      const res = await orderAPI.getAll();
      setOrders(res.data);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Orders</h1>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="p-3 text-left font-medium">Order</th><th className="p-3 text-left font-medium">Customer</th><th className="p-3 text-left font-medium">Items</th><th className="p-3 text-left font-medium">Total</th><th className="p-3 text-left font-medium">Status</th><th className="p-3 text-left font-medium">Payment</th><th className="p-3 text-left font-medium">Date</th><th className="p-3 text-left font-medium">Actions</th></tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t">
                  <td className="p-3 font-mono text-xs">#{order._id.toString().slice(-8)}</td>
                  <td className="p-3">{order.shippingAddress?.fullName || 'Guest'}</td>
                  <td className="p-3">{order.items?.length}</td>
                  <td className="p-3 font-medium">{order.total?.toLocaleString()} BDT</td>
                  <td className="p-3">
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className={`text-xs px-2 py-1 rounded-full border ${order.status === 'delivered' ? 'bg-green-50 border-green-300' : order.status === 'cancelled' ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">{order.isPaid ? <span className="text-green-600">Paid</span> : <span className="text-red-600">Unpaid</span>}</td>
                  <td className="p-3 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)} className="text-blue-600 hover:underline text-xs">
                      {selectedOrder?._id === order._id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{selectedOrder._id.toString().slice(-8)}</h2>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-2xl">&times;</button>
            </div>
            <div className="space-y-3">
              <div><h3 className="font-medium text-sm">Shipping Address</h3><p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.fullName}, {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.phone}</p></div>
              <div><h3 className="font-medium text-sm">Items</h3>{selectedOrder.items?.map((item, i) => <p key={i} className="text-sm text-gray-600">{item.name} x{item.quantity} - {(item.price * item.quantity).toLocaleString()} BDT</p>)}</div>
              <div className="border-t pt-2">
                <p className="text-sm">Subtotal: {selectedOrder.subtotal?.toLocaleString()} BDT</p>
                <p className="text-sm">Shipping: {selectedOrder.shippingCost === 0 ? 'Free' : `${selectedOrder.shippingCost} BDT`}</p>
                <p className="font-bold">Total: {selectedOrder.total?.toLocaleString()} BDT</p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Tracking</h3>
                <input type="text" placeholder="Tracking number" defaultValue={selectedOrder.trackingNumber || ''} className="input-field text-sm" onBlur={(e) => updateStatus(selectedOrder._id, selectedOrder.status, e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
