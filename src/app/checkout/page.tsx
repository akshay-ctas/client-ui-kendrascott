import CheckOutClient from "@/components/checkout/CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order by providing shipping and payment details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckOutPage() {
  return (
    <div className="container mx-auto px-6 py-10">
      <CheckOutClient />
    </div>
  );
}
