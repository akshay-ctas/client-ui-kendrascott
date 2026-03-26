"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

import { wishlistReducer } from "@/lib/wishlistReducer";
import { WishListState, WishListAction } from "@/lib/WishListTypes";
import { useQuery } from "@tanstack/react-query";
import { getwish } from "@/services/user.service";

type WishListContextType = {
  wishList: WishListState["wishList"];
  dispatch: React.Dispatch<WishListAction>;
};

const WishListContext = createContext<WishListContextType | undefined>(
  undefined,
);

const initialState: WishListState = {
  wishList: [],
};

export function WishListProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { data } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getwish,
  });

  useEffect(() => {
    if (data?.wishlist) {
      dispatch({
        type: "SET",
        payload: data.wishlist,
      });
    }
  }, [data]);

  return (
    <WishListContext.Provider
      value={{
        wishList: state.wishList,
        dispatch,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
}

export function useWishList() {
  const context = useContext(WishListContext);

  if (!context) {
    throw new Error("useWishList must be used inside WishListProvider");
  }

  return context;
}
