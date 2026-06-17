'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '@/lib/api';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getGuestId = () => {
    let guestId = Cookies.get('guestId');
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
      Cookies.set('guestId', guestId, { expires: 30 });
    }
    return guestId;
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      if (user) {
        const res = await cartAPI.get();
        data = res.data;
      } else {
        const res = await cartAPI.getGuest(getGuestId());
        data = res.data;
      }
      if (data) setCart(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, size, isStitched, quantity = 1) => {
    const payload = { productId, size, isStitched, quantity };
    if (!user) payload.guestId = getGuestId();
    const { data } = await cartAPI.add(payload);
    setCart(data);
  };

  const updateQuantity = async (itemId, quantity) => {
    const payload = { quantity };
    if (!user) payload.guestId = getGuestId();
    const { data } = await cartAPI.update(itemId, payload);
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await cartAPI.remove(itemId, user ? undefined : getGuestId());
    setCart(data);
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
