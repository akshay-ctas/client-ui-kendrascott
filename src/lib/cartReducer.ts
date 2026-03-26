import { CartAction, CartState } from "./cartTypes";

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return { cart: action.payload };

    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.variantId === action.payload.variantId,
      );

      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.variantId === action.payload.variantId
              ? {
                  ...item,
                  quantity: item.quantity + action.payload.quantity,
                }
              : item,
          ),
        };
      }

      return {
        cart: [...state.cart, action.payload],
      };
    }

    case "INCREASE_QUANTITY":
      return {
        cart: state.cart.map((item) =>
          item.variantId === action.payload && item.quantity < item.stock
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        cart: state.cart.map((item) =>
          item.variantId === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      };

    case "REMOVE_ITEM":
      return {
        cart: state.cart.filter((item) => item.variantId !== action.payload),
      };

    case "CLEAR_CART":
      return { cart: [] };

    default:
      return state;
  }
}
