import CartPage from "@/components/cart/CartPage";
import { Metadata } from "next";
import { getProducts } from "../actions/order.server";

export const metadata: Metadata = {
  title: "Your Shopping Bag",
  description: "Review the items in your cart before proceeding to checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  return <CartPage />;
}
