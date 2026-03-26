export type CartItem = {
  productId: string;
  productTitle: string;
  productSlug: string;
  variantId: string;
  sku: string;
  image: string;
  color: string;
  size: string;
  metalType: string;
  price: number;
  quantity: number;
  stock: number;
};

export type CartState = {
  cart: CartItem[];
};

export type CartAction =
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "INCREASE_QUANTITY"; payload: string }
  | { type: "DECREASE_QUANTITY"; payload: string }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };
