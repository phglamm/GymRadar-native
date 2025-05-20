import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add gym package to cart
  const addToCart = (gymPackage) => {
    setCart((prevCart) => {
      // Check if this exact package already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.packageId === gymPackage.id && item.gymId === gymPackage.gymId
      );

      if (existingItemIndex !== -1) {
        // If found, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // If not found, add new item with quantity 1
        return [
          ...prevCart,
          {
            gymId: gymPackage.gymId,
            gymName: gymPackage.gymName,
            gymAddress: gymPackage.gymAddress,
            gymImage: gymPackage.gymImage,
            packageId: gymPackage.id,
            packageName: gymPackage.name,
            packageType: gymPackage.type,
            price: gymPackage.price,
            quantity: 1,
          },
        ];
      }
    });
  };

  // Remove package from cart
  const removeFromCart = (gymId, packageId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.gymId === gymId && item.packageId === packageId)
      )
    );
  };

  // Increase package quantity
  const increaseQuantity = (gymId, packageId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.gymId === gymId && item.packageId === packageId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease package quantity
  const decreaseQuantity = (gymId, packageId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.gymId === gymId && item.packageId === packageId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Get total cart value
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Count items in cart
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Clear cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
