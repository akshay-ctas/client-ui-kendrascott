import { useState } from "react";
import { Heart, Trash } from "lucide-react";
import { useWishList } from "@/context/WishListContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearWishlist, toggleWishlist } from "@/services/wishlist.service";
import { toast } from "sonner";

export default function WishlistContent() {
  const { wishList, dispatch } = useWishList();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (productId: string) => toggleWishlist(productId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  const handleWishlist = (product: any) => {
    if (!product) return;

    dispatch({
      type: "TOGGLE",
      payload: {
        productId: product.productId,
        title: product.title,
        price: product.price,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
      },
    });

    mutate(product.productId);
  };

  const { mutate: clearMutation } = useMutation({
    mutationFn: clearWishlist,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  const handleClearWishList = () => {
    dispatch({
      type: "CLEAR",
    });
    clearMutation();
  };
  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 px-4 py-10">
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs tracking-[0.25em] uppercase text-amber-500 font-semibold">
              Your Collection
            </span>
          </div>

          <p className="text-stone-400 text-sm mt-1">
            {wishList.length} items saved
          </p>
        </div>

        <div className=" h-px bg-linear-to-r from-amber-400/40 via-stone-700 to-transparent" />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleClearWishList}
            className="flex items-center gap-2 text-xs uppercase tracking-widest hover:scale-105 hover:font-semibold duration-100 ease-in-out text-rose-500 bg-rose-100 px-2 py-1 rounded"
          >
            <Trash size={12} /> Clear WishList
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {wishList.map((item) => {
          const isWishlisted = wishList.some(
            (wishItem) => wishItem.productId === item.productId,
          );
          return (
            <div
              key={item.image}
              className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg `}
            >
              <div className="relative overflow-hidden h-52 bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h3 className="text-stone-800 font-semibold text-sm leading-snug mb-1 line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-amber-500 font-bold text-lg">
                    ₹{item.price}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWishlist(item)}
                      className="absolute bottom-4 right-4 p-2 rounded-full hover:scale-109 cursor-pointer duration-150 transition"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted
                            ? "fill-red-500 text-red-500"
                            : "text-gray-700"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {wishList.length === 0 && (
        <div className="max-w-5xl mx-auto text-center py-24">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-rose-300" />
          </div>
          <p className="text-stone-500 text-lg font-medium">
            Your wishlist is empty
          </p>
          <p className="text-stone-400 text-sm mt-1">
            Start saving items you love
          </p>
        </div>
      )}
    </div>
  );
}
