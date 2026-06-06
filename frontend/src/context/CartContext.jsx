import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newQty = currentQty + quantity;

      // Validate against available stock
      if (product.quantityInStock !== undefined && newQty > product.quantityInStock) {
        console.warn(`Cannot add more than ${product.quantityInStock} units of "${product.name}"`);
        return prevItems; // Return unchanged cart
      }

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === productId) {
            // Validate against available stock
            if (item.quantityInStock !== undefined && newQuantity > item.quantityInStock) {
              console.warn(`Cannot set quantity above available stock (${item.quantityInStock})`);
              return item; // Return unchanged item
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const checkout = () => {
    console.log('Initiating checkout...');
    setCartItems([]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (productId) => {
    return cartItems.find(item => item.id === productId)?.quantity || 0;
  };

  // Computed cart total
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.unitPrice || 0) * item.quantity;
  }, 0);

  // Computed cart item count
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        checkout,
        clearCart,
        getItemQuantity,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
