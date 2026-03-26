"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    cart,
    totalPrice,
  } = useCart();

  const router = useRouter();

  const isEmpty = !cart || cart.length === 0;

  return (
    <div
      className="min-h-screen bg-white text-stone-800"
      style={{ fontFamily: "Georgia, serif" }}
    >
      <div className="px-6 py-3 border-b border-stone-100">
        <div className="container mx-auto flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="hover:text-stone-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-700">Cart</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">
          Your Cart
          {!isEmpty && (
            <span className="text-stone-400 text-lg font-normal">
              ({cart.length} {cart.length === 1 ? "item" : "items"})
            </span>
          )}
        </h1>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-stone-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-stone-400 text-sm">Your cart is empty</p>
            <Link
              href="/products"
              className="mt-2 px-6 py-2.5 bg-stone-800 text-white text-sm rounded hover:bg-stone-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex justify-end">
                <button
                  onClick={() => clearCart()}
                  className="text-xs text-stone-400 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 py-4 border-b border-stone-100"
                >
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="shrink-0"
                  >
                    <div className="w-24 h-24 rounded overflow-hidden bg-stone-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-200 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col gap-1">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="font-semibold text-sm hover:underline"
                    >
                      {item.productTitle}
                    </Link>

                    <div className="flex flex-wrap gap-3 text-xs text-stone-400">
                      {item.size && (
                        <span>
                          Size:{" "}
                          <span className="text-stone-600">{item.size}</span>
                        </span>
                      )}
                      {item.color && (
                        <span>
                          Color:{" "}
                          <span className="text-stone-600">{item.color}</span>
                        </span>
                      )}
                      {item.metalType && (
                        <span>
                          Metal:{" "}
                          <span className="text-stone-600">
                            {item.metalType}
                          </span>
                        </span>
                      )}
                      <span>
                        SKU: <span className="text-stone-600">{item.sku}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded w-fit">
                        <button
                          onClick={() => decreaseQuantity(item.variantId)}
                          className="px-2.5 py-1 text-stone-500 hover:bg-stone-50 text-base leading-none"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm font-medium border-x border-stone-200 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.variantId)}
                          disabled={item.quantity >= item.stock}
                          className="px-2.5 py-1 text-stone-500 hover:bg-stone-50 text-base leading-none disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="border border-stone-100 rounded p-5 flex flex-col gap-4 sticky top-24">
                <h2 className="text-base font-semibold">Order Summary</h2>

                <hr className="border-stone-100" />

                <div className="flex flex-col gap-2">
                  {cart.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex justify-between text-sm text-stone-500"
                    >
                      <span className="truncate max-w-40">
                        {item.productTitle} × {item.quantity}
                      </span>
                      <span className="shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-stone-100" />

                <div className="flex justify-between text-sm text-stone-500">
                  <span>Shipping</span>
                  <span className={totalPrice >= 999 ? "text-green-600" : ""}>
                    {totalPrice >= 999 ? "Free" : "₹99"}
                  </span>
                </div>

                {totalPrice < 999 && (
                  <p className="text-xs text-stone-400">
                    Add ₹{(999 - totalPrice).toLocaleString()} more for free
                    shipping
                  </p>
                )}

                <hr className="border-stone-100" />

                <div className="flex justify-between font-bold text-stone-800">
                  <span>Total</span>
                  <span>
                    ₹
                    {(totalPrice < 999
                      ? totalPrice + 99
                      : totalPrice
                    ).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/checkout`)}
                  className="w-full py-3 bg-stone-800 text-white text-sm font-semibold rounded hover:bg-stone-700 transition-colors"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="text-center text-xs text-stone-400 hover:text-stone-700 transition-colors"
                >
                  ← Continue Shopping
                </Link>

                <div className="flex flex-col gap-1 text-xs text-stone-400 pt-1 border-t border-stone-100">
                  <span>🔒 Secure checkout</span>
                  <span>↩️ 30-day easy returns</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
