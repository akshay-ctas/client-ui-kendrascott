import { RazorpayResponse } from "@/components/checkout/PaymentMethod";
import { apiFetch } from "@/lib/api";

export const refundPayment = async ({
  paymentId,
  amount,
}: {
  paymentId: string;
  amount: number;
}) => {
  const res = await apiFetch(`/payment/refund/${paymentId}`, {
    method: "POST",
    body: { amount },
  });

  return res;
};

export const verifyPayment = async (
  response: RazorpayResponse,
  orderId: string,
  paymentId: string,
) => {
  const res = await apiFetch(
    `/payment/verify-payment/${orderId}/${paymentId}`,
    {
      method: "POST",
      body: response,
    },
  );

  return res;
};
