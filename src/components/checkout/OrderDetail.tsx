"use client";

import { useCart } from "@/hooks/useCart";
import Image from "next/image";

export default function OrderDetail({
  handlePlaceOrder,
}: {
  handlePlaceOrder: () => void;
}) {
  const { cart, totalPrice } = useCart();

  const deliveryCharge = totalPrice > 999 ? 0 : 99;
  const finalTotal = totalPrice + deliveryCharge;

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6 h-fit">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {cart.length === 0 ? (
          <p className="text-gray-400 text-sm">No items in cart</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.variantId}
              className="flex justify-between items-center gap-3"
            >
              <div className="flex gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg border overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.productTitle}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.productTitle}
                  </p>

                  <p className="text-xs text-gray-400">
                    {item.color} {item.size ? `• ${item.size}` : ""} • Qty:{" "}
                    {item.quantity}
                  </p>

                  <p className="text-xs text-gray-400">{item.metalType}</p>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-800 shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Delivery</span>
          <span>
            {deliveryCharge === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              `₹${deliveryCharge}`
            )}
          </span>
        </div>

        {totalPrice > 0 && totalPrice < 999 && (
          <p className="text-xs text-gray-400">
            Add ₹{(999 - totalPrice).toLocaleString("en-IN")} more for free
            delivery
          </p>
        )}

        <div className="border-t pt-3 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>₹{finalTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <button
        onClick={() => handlePlaceOrder()}
        disabled={cart.length === 0}
        className="w-full h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Place Order
      </button>
    </div>
  );
}
