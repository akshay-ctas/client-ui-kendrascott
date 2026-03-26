"use client";
import { getProductBySlug } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/lib/cartTypes";

export default function ProductDetails({ slug }: { slug: string }) {
  const {
    data: res,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });

  const product = res?.data;

  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectedVariant(product.variants[0]);
      setActiveImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedVariant?._id]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-400 text-sm">
        Loading product...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-sm">
        Error loading product
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-400 text-sm">
        Product not found
      </div>
    );

  const variantImages =
    product.images?.filter(
      (img: any) => img.variantId === selectedVariant?._id,
    ) || [];

  const displayImages =
    variantImages.length > 0 ? variantImages : product.images || [];

  const activeImage = displayImages[activeImageIndex];

  const handleCart = () => {
    if (!selectedVariant) return;
    const cartItem: CartItem = {
      productId: product._id,
      productTitle: product.title,
      productSlug: product.slug,
      variantId: selectedVariant._id,
      sku: selectedVariant.sku,
      image: activeImage?.url || "",
      color: selectedVariant.color || "",
      size: selectedVariant.size || "",
      metalType: selectedVariant.metalType || "",
      price: selectedVariant.price,
      quantity: quantity,
      stock: selectedVariant.stock,
    };
    addToCart(cartItem);
    toast.success("Product added to cart 🛒", {
      description: `${product.title} has been added successfully.`,
    });

    setTimeout(() => {
      router.push("/cart");
    }, 1200);
  };

  return (
    <div
      className="min-h-screen bg-white text-stone-800"
      style={{ fontFamily: "Georgia, serif" }}
    >
      <div className="px-6 py-3 mt-10">
        <div className="container mx-auto flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="hover:text-stone-700 transition-colors">
            Home
          </Link>
          {product.categories?.map((cat: any) => (
            <span key={cat.slug} className="flex items-center gap-2">
              <span>/</span>
              <Link
                href={`/${cat.slug}`}
                className="hover:text-stone-700 transition-colors capitalize"
              >
                {cat.name}
              </Link>
            </span>
          ))}
          <span>/</span>
          <span className="text-stone-700">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex gap-3">
          {displayImages.length > 1 && (
            <div className="flex flex-col gap-2">
              {displayImages.map((img: any, i: number) => (
                <button
                  key={img._id}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors shrink-0 ${
                    activeImageIndex === i
                      ? "border-stone-800"
                      : "border-stone-200"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 aspect-square rounded overflow-hidden bg-stone-50">
            {activeImage ? (
              <img
                src={activeImage.url}
                alt={activeImage.altText || product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Right — Details */}
        <div className="flex flex-col gap-5">
          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs text-stone-500 border border-stone-200 px-2 py-0.5 rounded capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            {selectedVariant?.sku && (
              <p className="text-sm text-stone-400 mt-1">
                SKU: {selectedVariant.sku}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              ₹{(selectedVariant?.price ?? 0).toLocaleString()}
            </span>
          </div>

          {product.description && (
            <p className="text-stone-500 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {selectedVariant && (
            <div className="flex flex-wrap gap-4 text-sm">
              {selectedVariant.metalType && (
                <span>
                  <span className="text-stone-400">Metal: </span>
                  <span className="font-medium">
                    {selectedVariant.metalType}
                  </span>
                </span>
              )}
              {selectedVariant.color && (
                <span>
                  <span className="text-stone-400">Color: </span>
                  <span className="font-medium">{selectedVariant.color}</span>
                </span>
              )}
              {selectedVariant.stoneType && (
                <span>
                  <span className="text-stone-400">Stone: </span>
                  <span className="font-medium">
                    {selectedVariant.stoneType}
                  </span>
                </span>
              )}
              {selectedVariant.weight && (
                <span>
                  <span className="text-stone-400">Weight: </span>
                  <span className="font-medium">{selectedVariant.weight}g</span>
                </span>
              )}
            </div>
          )}

          <hr className="border-stone-100" />

          {product.variants?.length > 1 && (
            <div>
              <p className="text-sm font-semibold mb-2">Variants</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 text-sm border rounded transition-colors ${
                      selectedVariant?._id === v._id
                        ? "border-stone-800 bg-stone-800 text-white"
                        : "border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {v.size || v.color || v.sku}
                  </button>
                ))}
              </div>
              {selectedVariant?.stock !== undefined && (
                <p className="text-xs text-stone-400 mt-1">
                  {selectedVariant.stock} in stock
                </p>
              )}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold mb-2">Quantity</p>
            <div className="flex items-center border border-stone-200 rounded w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-stone-500 hover:bg-stone-50 text-lg leading-none"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium border-x border-stone-200 min-w-10 text-center">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(
                    Math.min(selectedVariant?.stock ?? 99, quantity + 1),
                  )
                }
                className="px-3 py-2 text-stone-500 hover:bg-stone-50 text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCart}
              disabled={!selectedVariant || !selectedVariant.isAvailable}
              className={`flex-1 py-3 rounded text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
               bg-stone-800 text-white hover:bg-stone-700
              `}
            >
              Add to Cart
            </button>
            <button
              onClick={() => setWishlist(!wishlist)}
              className="px-3 py-3 rounded border border-stone-200 hover:border-stone-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 ${
                  wishlist
                    ? "fill-red-500 stroke-red-500"
                    : "fill-none stroke-stone-400"
                }`}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-stone-400 pt-1 border-t border-stone-100">
            <span>🚚 Free shipping above ₹999</span>
            <span>↩️ 30-day returns</span>
            <span>🔒 Secure checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
