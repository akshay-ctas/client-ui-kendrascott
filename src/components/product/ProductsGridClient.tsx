"use client";

import ProductsGrid from "@/components/product/ProductsGrid";
import { useSearchParams } from "next/navigation";

export default function ProductsGridClient() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  return <ProductsGrid search={search} />;
}
