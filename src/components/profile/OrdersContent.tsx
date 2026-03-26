"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersList({ orders, loading }: any) {
  const router = useRouter();
  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="text-center py-10 text-gray-400 font-medium text-sm">
        No orders found
      </div>
    );

  return (
    <div className="w-full mx-auto px-3 py-4">
      <div className="mb-8  border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 ">
            <span className="text-xs tracking-[0.25em] uppercase text-amber-500 font-semibold">
              My Orders
            </span>
          </div>

          <p className="text-stone-400 text-sm mt-1">{orders.length} orders</p>
        </div>

        <div className=" h-px bg-linear-to-r from-amber-400/40 via-stone-700 to-transparent" />
      </div>
      <div className="space-y-3">
        {orders &&
          orders.map((order: any) => (
            <div
              key={order.id}
              className=" cursor-pointer hover:bg-slate-50 border-gray-200 rounded-xl bg-white px-4 py-3"
              onClick={() => router.push(`/order/${order.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-800">
                  Order #{order.id}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {order.items.slice(0, 2).map((item: any) => (
                  <Link
                    key={item.variantId}
                    href={`/products/${item.productSlug}`}
                    className="flex items-center gap-2 border border-gray-100 rounded-lg px-2 py-2 w-1/2"
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {item.productTitle}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        SKU: {item.sku}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className=" text-xs text-muted-foreground font-semibold mt-0.5">
                          ₹{item.price} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-900 font-semibold mt-0.5">
                          ₹{item.total}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {order.items.length > 2 && (
                  <div className="text-[11px] text-gray-500 whitespace-nowrap">
                    +{order.items.length - 2} more
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-600">
                <div>
                  <span className="text-gray-500">Total: </span>
                  <span className="font-semibold text-gray-900">
                    ₹{order.pricing.total}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">Payment </span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
