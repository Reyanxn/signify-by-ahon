'use client';
import { useState, useEffect } from 'react';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getAll().then(res => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    try {
      await userAPI.update(user._id, { role: newRole });
      toast.success(`Role changed to ${newRole}`);
      setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await userAPI.delete(id); toast.success('Deleted'); setUsers(users.filter(u => u._id !== id)); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Users</h1>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="p-3 text-left font-medium">Name</th><th className="p-3 text-left font-medium">Email</th><th className="p-3 text-left font-medium">Role</th><th className="p-3 text-left font-medium">Joined</th><th className="p-3 text-left font-medium">Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-gray-500">{u.email}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 text-xs rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                  <td className="p-3 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => toggleRole(u)} className="text-blue-600 hover:underline text-xs">{u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</button>
                    <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
