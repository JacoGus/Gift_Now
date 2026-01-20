import React, { createContext, useContext, useState } from 'react';
import { SHOPS as DEFAULT_SHOPS } from '../data/mock';

// Helper: parse price strings like "5,89" or "5.89" into number (5.89)
const parsePrice = (value) => {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  // remove currency symbols and spaces
  let s = String(value).trim();
  s = s.replace(/[^0-9,.-]/g, '');
  // if contains comma and dot, assume comma is thousand separator -> remove dots, replace comma
  if (s.indexOf(',') > -1 && s.indexOf('.') > -1) {
    s = s.replace(/\./g, '').replace(/,/g, '.');
  } else {
    // replace comma with dot
    s = s.replace(/,/g, '.');
  }
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
};

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // initialize shops and ensure each shop has items array
  const [shops, setShops] = useState(
    DEFAULT_SHOPS.map(s => ({ ...s, items: s.items || [], id: s.id }))
  );

  const [cart, setCart] = useState([]); // { shopId, itemId, name, price, qty }
  const [orders, setOrders] = useState([]);

  // Shops CRUD
  const addShop = (shop) => {
    const id = Date.now();
    const newShop = { ...shop, id, items: shop.items || [] };
    setShops(prev => [newShop, ...prev]);
    return newShop;
  };

  const updateShop = (id, updates) => {
    setShops(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteShop = (id) => {
    setShops(prev => prev.filter(s => s.id !== id));
    // remove items from cart that belonged to the shop
    setCart(prev => prev.filter(c => c.shopId !== id));
  };

  // Items CRUD within shops
  const addItem = (shopId, item) => {
    const itemId = Date.now();
    setShops(prev => prev.map(s => {
      if (s.id === shopId) {
        const priceNum = parsePrice(item.price);
        const newItem = { ...item, id: itemId, price: priceNum };
        return { ...s, items: [...(s.items || []), newItem] };
      }
      return s;
    }));
    return itemId;
  };

  const updateItem = (shopId, itemId, updates) => {
    setShops(prev => prev.map(s => {
      if (s.id === shopId) {
        return { ...s, items: (s.items || []).map(i => i.id === itemId ? { ...i, ...updates } : i) };
      }
      return s;
    }));
  };

  const deleteItem = (shopId, itemId) => {
    setShops(prev => prev.map(s => {
      if (s.id === shopId) {
        return { ...s, items: (s.items || []).filter(i => i.id !== itemId) };
      }
      return s;
    }));
    // remove from cart
    setCart(prev => prev.filter(c => !(c.shopId === shopId && c.itemId === itemId)));
  };

  // Cart functions
  const addToCart = (shopId, itemId, name, price, qty = 1) => {
    console.log('[ShopContext] addToCart called:', { shopId, itemId, name, price, qty });
    const priceNum = parsePrice(price);
    setCart(prev => {
      const existing = prev.find(c => c.shopId === shopId && c.itemId === itemId);
      if (existing) {
        const newCart = prev.map(c => c.shopId === shopId && c.itemId === itemId ? { ...c, qty: c.qty + qty } : c);
        console.log('[ShopContext] Item already exists, updating qty:', newCart);
        return newCart;
      }
      const newCart = [...prev, { shopId, itemId, name, price: priceNum, qty }];
      console.log('[ShopContext] Adding new item to cart:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (shopId, itemId) => {
    setCart(prev => {
      const newCart = prev.filter(c => !(c.shopId === shopId && c.itemId === itemId));
      return newCart;
    });
  };

  const updateCartQty = (shopId, itemId, qty) => {
    console.log('[ShopContext] updateCartQty called:', { shopId, itemId, qty });
    setCart(prev => {
      if (qty <= 0) {
        const newCart = prev.filter(c => !(c.shopId === shopId && c.itemId === itemId));
        console.log('[ShopContext] Qty <= 0, removing item:', newCart);
        return newCart;
      }
      const newCart = prev.map(c => c.shopId === shopId && c.itemId === itemId ? { ...c, qty } : c);
      console.log('[ShopContext] Updating qty:', newCart);
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  // Checkout: create order(s) grouped by shop
  const checkout = (customer) => {
    // group cart items by shop
    const shopsMap = {};
    cart.forEach(ci => {
      if (!shopsMap[ci.shopId]) shopsMap[ci.shopId] = [];
      shopsMap[ci.shopId].push(ci);
    });

    const newOrders = Object.keys(shopsMap).map(shopId => {
      const id = 'ORD-' + Date.now() + '-' + shopId;
      const items = shopsMap[shopId];
      const subtotal = items.reduce((s, it) => s + (Number(it.price) * it.qty || 0), 0);
      const deliveryFee = 5.9; // simple static fee per shop for now
      const total = subtotal + deliveryFee;
      return {
        id,
        shopId,
        items,
        subtotal,
        deliveryFee,
        total,
        status: 'Pendente',
        customer,
        createdAt: new Date().toISOString(),
      };
    });

    setOrders(prev => [...newOrders, ...prev]);
    clearCart();
    return newOrders;
  };

  // Orders CRUD
  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelado' } : o));
  };

  return (
    <ShopContext.Provider value={{
      shops,
      addShop,
      updateShop,
      deleteShop,
      addItem,
      updateItem,
      deleteItem,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      checkout,
      orders,
      cancelOrder,
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
};
