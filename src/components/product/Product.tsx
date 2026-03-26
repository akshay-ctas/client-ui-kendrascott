"use client";
import Image from "next/image";
import { getProductsByCategories } from "@/services/product.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useWishList } from "@/context/WishListContext";
import { toggleWishlist } from "@/services/wishlist.service";
import { toast } from "sonner";

interface ProductProps {
  categoryId: string;
}

export function Product({ categoryId }: ProductProps) {
  const [page, setPage] = useState(1);
  const { dispatch, wishList } = useWishList();

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", categoryId, page],
    queryFn: () => getProductsByCategories(categoryId, page),
  });

  const products = data?.products || [];

  const { mutate } = useMutation({
    mutationFn: (productId: string) => toggleWishlist(productId),
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
  const handleWishlist = (product: any) => {
    dispatch({
      type: "TOGGLE",
      payload: {
        productId: product._id,
        title: product.title,
        price: product.variants.price,
        image: product.images[0].url,
      },
    });

    mutate(product._id);
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;
  if (!products.length) return <div>No products found</div>;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: any) => {
          const isWishlisted = wishList.some(
            (item) => item.productId === product._id,
          );
          return (
            <div
              key={product._id}
              className="cursor-pointer group relative overflow-hidden   transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={product?.images[0].url}
                  className="w-full h-137.5 object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[1px]"
                  alt={product.title}
                />

                <img
                  src={product.images[1]?.url || product.images[0].url}
                  className="absolute inset-0 w-full h-137.5 object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100 blur-sm group-hover:blur-none"
                  alt={product.title}
                />

                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -skew-x-12 transform -translate-x-full group-hover:translate-x-full"></div>

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="px-2 py-4 bg-white/80 backdrop-blur-sm group-hover:bg-white transition-all duration-300 relative z-10">
                <h1 className="text-black mt-2 text-xl font-semibold line-clamp-2 group-hover:text-gray-800 transition-colors">
                  {product.title}
                </h1>
                <button
                  onClick={() => handleWishlist(product)}
                  className="absolute bottom-2 right-5 p-2 rounded-full cursor-pointer hover:scale-125 duration-200 transition-all hover:bg-white  transition"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700"
                    }`}
                  />
                </button>
                <p className="text-slate-700 mt-4 font-bold text-lg bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  ₹{Number(product.variants[0].price).toLocaleString()}
                </p>
                {product.variants[0]?.stock > 0 && (
                  <Link
                    href={`/products/${product.slug}`}
                    className="absolute top-7 right-4 group p-2.5 bg-white/90 hover:bg-white rounded-2xl  border border-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 z-20"
                  >
                    <ShoppingCart className="w-6 h-6 text-gray-800 group-hover:text-indigo-600 transition-colors" />
                  </Link>
                )}

                {product.variants[0].stock > 0 ? (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
                    {product.variants[0].stock} left
                  </span>
                ) : (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center px-6 py-4 border-t">
        <div className="text-sm text-slate-500">
          Page {data?.page} of {data?.totalPages}
        </div>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded "
          >
            Prev
          </button>

          <button
            disabled={page === data?.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
