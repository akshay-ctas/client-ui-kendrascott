"use client";

import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  AlertCircle,
  Banknote,
  CreditCard,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { CheckoutData } from "@/app/actions/order.server";
import { useMutation } from "@tanstack/react-query";
import { refundPayment, verifyPayment } from "@/services/payment.service";
import { verifyPriceAndCreateOrder } from "@/services/order.service";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

type PaymentMethod = "online" | "cash";

type PaymentMethodProps = {
  setCheckout: Dispatch<
    SetStateAction<{ addressId: string; paymentMethod: string }>
  >;
  checkoutData: CheckoutData;
};

export type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type VerifyPaymentPayload = {
  response: RazorpayResponse;
  orderId: string;
  paymentId: string;
};

declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

function useRazorpayScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
    return () => {
      const scripts = document.querySelectorAll('script[src*="razorpay.com"]');
      scripts.forEach((s) => s.remove());
    };
  }, []);

  return ready;
}

export default function PaymentMethod({
  setCheckout,
  checkoutData,
}: PaymentMethodProps) {
  const [selected, setSelected] = useState<PaymentMethod>("cash");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");

  const paymentCreatedRef = useRef(false);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();

  const scriptReady = useRazorpayScript();
  const isPaymentLocked = paymentStatus === "success";

  const verifyPaymentMutation = useMutation<
    { success: boolean; orderId: string; paymentId: string; message: string },
    Error,
    VerifyPaymentPayload
  >({
    mutationFn: ({ response, orderId, paymentId }) =>
      verifyPayment(response, orderId, paymentId),
    onSuccess: (result) => {
      setPaymentStatus(result.success ? "success" : "failed");
      toast.success(result.message || "Your order has been confirmed!");
      clearCart();

      router.push(`/order/${result.orderId}?success=true`);
    },
    onError: () => setPaymentStatus("failed"),
  });

  const handleRazorpaySuccess = useCallback(
    async ({
      response,
      orderId,
      paymentId,
      amount,
    }: {
      response: RazorpayResponse;
      orderId: string;
      paymentId: string;
      amount: number;
    }) => {
      setPaymentStatus("processing");
      try {
        await verifyPaymentMutation.mutateAsync({
          response,
          orderId,
          paymentId,
        });
      } catch {
        const res = await refundPayment({ paymentId, amount });
        if (res.success) {
          toast.success(
            "Order creation failed. Your payment will be refunded automatically within 24 hours.",
          );
        }
        setPaymentStatus("failed");
      }
    },
    [verifyPaymentMutation],
  );

  const paymentMutation = useMutation({
    mutationFn: () => verifyPriceAndCreateOrder(checkoutData),
    onSuccess: (data) => {
      if (!scriptReady || typeof window === "undefined" || !window.Razorpay) {
        setPaymentStatus("failed");
        return;
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        setPaymentStatus("failed");
        return;
      }

      const rzp = new window.Razorpay({
        key: keyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: data.currency ?? "INR",
        name: "kendrascott",
        prefill: {
          name: user?.firstName + " " + user?.lastName || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#10b981" },
        handler: (response: RazorpayResponse) =>
          handleRazorpaySuccess({
            response,
            orderId: data?.orderId,
            paymentId: data?.paymentId,
            amount: data?.amount,
          }),
        modal: {
          ondismiss: () => {
            paymentCreatedRef.current = false;
            setPaymentStatus("idle");
          },
        },
      });

      rzp.on("payment.failed", () => setPaymentStatus("failed"));
      rzp.open();
    },
    onError: () => {
      paymentCreatedRef.current = false;
      setPaymentStatus("failed");
    },
  });

  useEffect(() => {
    if (paymentStatus !== "idle") paymentCreatedRef.current = false;
  }, [paymentStatus]);

  const methods = [
    {
      id: "online" as const,
      label: "Pay Online",
      description: "UPI, Cards, Net Banking & Wallets",
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      badge: "Recommended",
    },
    {
      id: "cash" as const,
      label: "Cash on Delivery",
      description: "Pay when your order is delivered",
      icon: <Banknote className="w-5 h-5 text-green-600" />,
      badge: null,
    },
  ] as const;

  const handleSelect = (id: PaymentMethod) => {
    if (isPaymentLocked) return;
    setSelected(id);
    setPaymentStatus("idle");
    setCheckout((prev) => ({ ...prev, paymentMethod: id }));

    if (id === "online" && !paymentCreatedRef.current) {
      paymentCreatedRef.current = true;
      paymentMutation.mutate();
    }
  };

  const handleRetry = () => {
    if (isPaymentLocked) return;
    setPaymentStatus("idle");
    paymentCreatedRef.current = true;
    paymentMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Choose Payment Method
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelect(method.id)}
            disabled={paymentMutation.isPending || isPaymentLocked}
            className={`group border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between transition-all duration-200 text-left w-full h-24 md:h-auto ${
              selected === method.id && !isPaymentLocked
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md"
                : "border-gray-200 hover:border-blue-300 hover:shadow-lg hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-start md:items-center gap-4 flex-1">
              <div
                className={`p-3 rounded-2xl shadow-sm transition-all ${
                  method.id === "online"
                    ? "bg-linear-to-br from-blue-100 to-blue-200"
                    : "bg-linear-to-br from-green-100 to-green-200"
                }`}
              >
                {method.icon}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {method.label}
                  </p>
                  {method.badge && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-tight">
                  {method.description}
                </p>
              </div>
            </div>
            <div className="shrink-0 ml-4">
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  selected === method.id && !isPaymentLocked
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      {selected === "online" && (
        <div className="mt-4 space-y-3">
          {paymentMutation.isPending && (
            <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Setting up secure payment...
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Opening Razorpay checkout
                </p>
              </div>
            </div>
          )}
          {paymentStatus === "processing" && (
            <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 shadow-sm">
              <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
              <p className="text-sm text-yellow-700">
                Payment completed, verifying...
              </p>
            </div>
          )}
          {paymentStatus === "success" && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-800">
                Payment Successful! 🎉
              </p>
            </div>
          )}
          {paymentStatus === "failed" && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-semibold text-red-800">
                  Payment Failed
                </p>
                <button
                  onClick={handleRetry}
                  disabled={paymentMutation.isPending || isPaymentLocked}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 mt-2 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Retry Payment
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selected === "cash" && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
          <Banknote className="w-4 h-4" />
          <span>Please keep exact change ready at the time of delivery</span>
        </div>
      )}
    </div>
  );
}
