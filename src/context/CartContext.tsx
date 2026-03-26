"use client";

import { CartAction, CartItem, CartState } from "@/lib/cartTypes";
import { getCartFromDB, saveCartToDB } from "@/lib/cartDb";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { cartReducer } from "@/lib/cartReducer";

type CartContextType = {
  cart: CartItem[];
  dispatch: React.Dispatch<CartAction>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  cart: [],
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    async function loadCart() {
      const items = await getCartFromDB();
      dispatch({ type: "SET_CART", payload: items });
    }

    loadCart();
  }, []);

  useEffect(() => {
    async function saveCart() {
      await saveCartToDB(state.cart);
    }

    saveCart();
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ cart: state.cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used inside CartProvider");
  }

  return context;
}
