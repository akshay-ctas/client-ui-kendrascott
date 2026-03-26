import ProductsGridClient from "@/components/product/ProductsGridClient";
import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full jewelry collection including necklaces, earrings, rings, and accessories.",
  keywords: [
    "jewelry collection",
    "all products",
    "necklaces",
    "earrings",
    "rings",
    "fashion accessories",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "All Products",
    description:
      "Browse our full jewelry collection including necklaces, earrings, rings, and accessories.",
    url: "/products",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products",
    description:
      "Browse our full jewelry collection including necklaces, earrings, rings, and accessories.",
  },
};
export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-stone-400 text-sm">
          Loading...
        </div>
      }
    >
      <ProductsGridClient />
    </Suspense>
  );
}
