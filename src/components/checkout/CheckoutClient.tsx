"use client";

import { CheckoutData } from "@/app/actions/order.server";

import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { toast } from "sonner";
import Addresses from "@/components/checkout/Addresses";
import Breadcrumb, { BreadcrumbItem } from "@/components/checkout/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import PersonalDetails from "@/components/checkout/PersonalDetails";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderDetail from "@/components/checkout/OrderDetail";
import { useMutation } from "@tanstack/react-query";
import { verifyPriceAndCreateOrder } from "@/services/order.service";
import { redirect, useRouter } from "next/navigation";

const breadcrumbItems: BreadcrumbItem[] = [
  {
    name: "cart",
    href: "/cart",
  },
  {
    name: "checkout",
    href: "/checkout",
  },
];

export default function CheckOutClient() {
  const { user, accessToken } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [checkout, setCheckout] = useState({
    addressId: "",
    paymentMethod: "",
  });

  const paymentMutation = useMutation({
    mutationFn: () => verifyPriceAndCreateOrder(checkoutData),
    onSuccess: (data) => {
      toast.success(data.message || "Your order has been confirmed!");
      clearCart();
      router.push(`/order/${data.orderId}?success=true`);
    },
  });
  if (!user && !accessToken) redirect("/auth");

  const checkoutData: CheckoutData = {
    userId: user!.id,
    addressId: checkout.addressId,
    paymentMethod: checkout.paymentMethod,
    cart: cart.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    })),
  };

  const handlePlaceOrder = () => {
    if (checkout.addressId === "") {
      toast.error("address is required");
    }
    if (checkout.paymentMethod === "") {
      toast.error("paymentMethod is required");
    }
    paymentMutation.mutate();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white border rounded-xl p-8 space-y-8">
        <Breadcrumb items={breadcrumbItems} />
        <PersonalDetails />
        <Addresses setCheckout={setCheckout} />
        <PaymentMethod checkoutData={checkoutData} setCheckout={setCheckout} />
      </div>
      <OrderDetail handlePlaceOrder={handlePlaceOrder} />
    </div>
  );
}
