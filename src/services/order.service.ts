import { CheckoutData } from "@/app/actions/order.server";
import { apiFetch } from "@/lib/api";

export const verifyPriceAndCreateOrder = async (checkoutData: CheckoutData) => {
  const res = await apiFetch("/order/create-order", {
    method: "POST",
    body: checkoutData,
  });

  return res;
};
