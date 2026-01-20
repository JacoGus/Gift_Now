import React, { createContext, useContext, useState } from 'react';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'CREDIT_CARD',
      brand: 'Mastercard',
      last4: '4589',
      holderName: 'JOÃO SILVA',
      expiryMonth: '12',
      expiryYear: '2025',
      icon: 'card-outline',
    },
    {
      id: '2',
      type: 'CREDIT_CARD',
      brand: 'Visa',
      last4: '1234',
      holderName: 'JOÃO SILVA',
      expiryMonth: '06',
      expiryYear: '2026',
      icon: 'card-outline',
    },
    {
      id: 'pix',
      type: 'PIX',
      holderName: 'PIX',
      icon: 'qr-code-outline',
    }
  ]);

  const addPaymentMethod = (method) => {
    const id = Date.now().toString();
    const newMethod = { ...method, id };
    setPaymentMethods(prev => [newMethod, ...prev]);
    return newMethod;
  };

  const updatePaymentMethod = (id, updates) => {
    setPaymentMethods(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deletePaymentMethod = (id) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
  };

  return (
    <PaymentContext.Provider value={{
      paymentMethods,
      addPaymentMethod,
      updatePaymentMethod,
      deletePaymentMethod,
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
};
