import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (gymPackage) => {
    setCart((prevCart) => {
      // Create unique identifier for cart item
      const cartItemId =
        gymPackage.type === "WithPT" && gymPackage.pt
          ? `${gymPackage.gymId}-${gymPackage.id}-${gymPackage.pt.id}`
          : `${gymPackage.gymId}-${gymPackage.id}`;

      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => {
        if (gymPackage.type === "WithPT" && gymPackage.pt) {
          return (
            item.gymId === gymPackage.gymId &&
            item.id === gymPackage.id &&
            item.pt?.id === gymPackage.pt.id
          );
        } else {
          return item.gymId === gymPackage.gymId && item.id === gymPackage.id;
        }
      });

      if (existingItemIndex !== -1) {
        // Item already exists, you might want to show a message or update quantity
        console.log("Item already in cart");
        return prevCart;
      }

      // Add new item to cart
      const newCartItem = {
        ...gymPackage,
        cartItemId,
        quantity: 1, // You can add quantity management if needed
        dateAdded: new Date().toISOString(),
      };

      return [...prevCart, newCartItem];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.length;
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  // Check if a specific package is in cart
  const isPackageInCart = (gymId, packageId, ptId = null) => {
    return cart.some((item) => {
      if (ptId) {
        return (
          item.gymId === gymId && item.id === packageId && item.pt?.id === ptId
        );
      }
      return item.gymId === gymId && item.id === packageId;
    });
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    getTotalPrice,
    isPackageInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
