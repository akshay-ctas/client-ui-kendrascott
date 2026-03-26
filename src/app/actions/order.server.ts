"use server";

import { apiFetch } from "@/lib/api";
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

export async function getCategories() {
  const res = await fetch(`${process.env.BASE_URL}/categories/tree`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }

  const result = await res.json();

  return result?.data || [];
}
