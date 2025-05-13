import { View, Text } from "react-native";
import React from "react";

export const CartContext = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, selectedOption) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.boxId === product.boxId &&
          item.selectedOption.boxOptionId === selectedOption.boxOptionId
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, selectedOption, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (boxId, boxOptionId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          item.boxId !== boxId ||
          item.selectedOption.boxOptionId !== boxOptionId
      )
    );
  };

  const increaseQuantity = (boxId, boxOptionId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.boxId === boxId && item.selectedOption.boxOptionId === boxOptionId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (boxId, boxOptionId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.boxId === boxId &&
          item.selectedOption.boxOptionId === boxOptionId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
