"use server";

import { serverApiFetch } from "@/lib/serverApi";

export async function getOrderById(orderId: string) {
  return serverApiFetch(`/order/${orderId}`);
}

export async function getOrders() {
  return serverApiFetch(`/order`);
}

export async function getProducts() {
  return await serverApiFetch(`/product/search?limit=all`);
}

export type CheckoutCartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type CheckoutData = {
  userId: string;
  addressId: string;
  paymentMethod: string;
  cart: CheckoutCartItem[];
};
