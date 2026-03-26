import { WishListAction, WishListState } from "./WishListTypes";

export const wishlistReducer = (
  state: WishListState,
  action: WishListAction,
): WishListState => {
  switch (action.type) {
    case "SET":
      return {
        wishList: Array.isArray(action.payload)
          ? action.payload
          : [action.payload],
      };
    case "TOGGLE":
      const exists = state.wishList.find(
        (item) => item.productId === action.payload.productId,
      );

      if (exists) {
        return {
          ...state,
          wishList: state.wishList.filter(
            (item) => item.productId !== action.payload.productId,
          ),
        };
      }

      return {
        ...state,
        wishList: [...state.wishList, action.payload],
      };

    case "CLEAR":
      return {
        wishList: [],
      };

    default:
      return state;
  }
};
