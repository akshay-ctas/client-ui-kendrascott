import { getOrderById } from "@/app/actions/order.server";
import { formatDate } from "@/lib/utils";
import { PartyPopper } from "lucide-react";
import { Metadata } from "next";

const steps = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

interface Props {
  params: Promise<{ orderId: string }>;
  searchParams?: Promise<{ success?: string }>;
}
type Items = {
  productId: string;
  productTitle?: string;
  productSlug?: string;
  image?: string;
  variantId?: string;
  sku?: string;
  price?: number;
  quantity: number;
  total: number;
};

export default async function OrderDetailsPage({
  params,
  searchParams,
}: Props) {
  const { orderId } = await params;
  const resolvedSearch = await searchParams;

  const data = await getOrderById(orderId);

  const order = data.data;
  if (!order) return;
  const currentStep = steps.findIndex(
    (step) => step.toLowerCase() === order.status.toLowerCase(),
  );
  const showSuccess = resolvedSearch?.success === "true";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <div className="container mx-auto px-4 py-10 space-y-4">
        {showSuccess && (
          <div
            className={`flex items-center justify-between gap-3 bg-green-600 text-stone-50 rounded-xl px-5 py-4`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                <PartyPopper />
              </span>
              <div>
                <p className="font-semibold text-sm">
                  Order placed successfully!
                </p>
                <p className="text-xs text-white mt-0.5">
                  We'll notify you when it's packed.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={`flex items-start justify-between flex-wrap gap-3`}>
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1 font-medium">
              Order ID
            </p>
            <p className="font-mono text-sm bg-stone-200 text-stone-700 px-2.5 py-1 rounded-lg inline-block">
              #{order.id.slice(-10).toUpperCase()}
            </p>
            <p className="text-xs text-stone-400 mt-1.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        <div className={`bg-white border border-stone-100 rounded-2xl p-5`}>
          <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-4">
            Tracking
          </p>
          <div className="flex items-center">
            {steps.map((step, i) => (
              <div
                key={step}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                    ${i < currentStep ? "bg-stone-900 text-white" : i === currentStep ? "bg-amber-500 text-white ring-4 ring-amber-100" : "bg-stone-100 text-stone-400"}`}
                  >
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-[10px] font-medium whitespace-nowrap ${i <= currentStep ? "text-stone-700" : "text-stone-400"}`}
                  >
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mb-4 rounded-full ${i < currentStep ? "bg-stone-900" : "bg-stone-100"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div
            className={`col-span-2 bg-white border border-stone-100 rounded-2xl overflow-hidden`}
          >
            <div className="px-5 pt-5 pb-3 flex items-center gap-2 border-b border-stone-50">
              <span className="text-base">🛍️</span>
              <h2 className="font-semibold text-base">Items Ordered</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {order.items &&
                order.items.map((item: Items) => (
                  <div
                    key={item.variantId}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm capitalize truncate">
                        {item.productTitle}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        SKU: {item.sku}
                      </p>
                      <p className="text-xs text-stone-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-stone-800">
                      ₹{item.total}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className={`grid grid-cols-1  gap-4`}>
            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📦</span>
                <h2 className="font-semibold text-sm">Delivery Address</h2>
              </div>
              <p className="font-medium text-sm">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 &&
                  `, ${order.shippingAddress.addressLine2}`}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
                {order.shippingAddress.zipCode}
                <br />
                {order.shippingAddress.country}
              </p>
              <div className="mt-3 pt-3 border-t border-stone-50 flex items-center gap-1.5 text-xs text-stone-500">
                <span>📞</span> {order.shippingAddress.phone}
              </div>
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">💳</span>
                <h2 className="font-semibold text-sm">Payment</h2>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Status</span>
                  <span
                    className={`font-medium capitalize px-2 py-0.5 rounded-full text-xs
                  ${order.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="border-t border-stone-50 pt-2.5 space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Subtotal</span>
                    <span>₹{order.pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Shipping</span>
                    <span>
                      {order.pricing.shipping === 0
                        ? "Free"
                        : `₹${order.pricing.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Tax</span>
                    <span>₹{order.pricing.tax}</span>
                  </div>
                  {order.pricing.discount > 0 && (
                    <div className="flex justify-between text-xs text-green-600">
                      <span>Discount</span>
                      <span>−₹{order.pricing.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-sm pt-1.5 border-t border-stone-100">
                    <span>Total</span>
                    <span>₹{order.pricing.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`bg-white border border-stone-100 rounded-2xl p-5 flex items-center gap-4`}
        >
          <div className="w-10 h-10 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center text-sm font-semibold shrink-0 uppercase">
            {order.user.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm capitalize">{order.user.name}</p>
            <p className="text-xs text-stone-400">{order.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId } = await params;

  return {
    title: `Order #${orderId.slice(-6).toUpperCase()}`,
    description: "Track your order status and view order details.",
    robots: {
      index: false,
      follow: false,
    },
  };
}
