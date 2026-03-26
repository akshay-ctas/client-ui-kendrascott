export type WishListItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
};

export type WishListState = {
  wishList: WishListItem[];
};

export type WishListAction =
  | { type: "ADD"; payload: WishListItem }
  | { type: "SET"; payload: WishListItem }
  | { type: "REMOVE"; payload: string }
  | { type: "TOGGLE"; payload: WishListItem }
  | { type: "CLEAR" };
