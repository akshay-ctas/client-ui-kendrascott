import { apiFetch } from "@/lib/api";

export const toggleWishlist = (productId: string) => {
  return apiFetch(`/users/wishlist/${productId}/`, {
    method: "POST",
  });
};

export const clearWishlist = () => {
  return apiFetch(`/users/wishlist`, {
    method: "POST",
  });
};
