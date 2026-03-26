"use client";

import { useCartContext } from "@/context/CartContext";
import { CartItem } from "@/lib/cartTypes";

export function useCart() {
  const { cart, dispatch } = useCartContext();

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const increaseQuantity = (variantId: string) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: variantId });
  };

  const decreaseQuantity = (variantId: string) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: variantId });
  };

  const removeItem = (variantId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: variantId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  return {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  };
}
