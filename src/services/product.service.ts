import { apiFetch } from "@/lib/api";

export const getProductsByCategories = async (
  categoryId: string,
  page: number = 1,
  limit: number = 8,
) => {
  const params = new URLSearchParams({
    categories: categoryId,
    page: page.toString(),
    limit: limit.toString(),
  });

  return await apiFetch(`/product?${params.toString()}`, {
    method: "GET",
  });
};

export const getProductBySlug = async (slug: string) => {
  return await apiFetch(`/product/${slug}`, { method: "GET" });
};

export const getProductsForSearch = async (
  search?: string,
  page: number = 1,
  selectedCategories: string[] = [],
  minPrice: number = 0,
  maxPrice: number = 100000,
  sortBy: string = "price_asc",
  limit: number = 8,
) => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  params.append("minPrice", minPrice.toString());
  params.append("maxPrice", maxPrice.toString());
  params.append("sortBy", sortBy.toString());
  if (selectedCategories.length > 0) {
    params.append("categories", selectedCategories.join(","));
  }
  return await apiFetch(`/product/search?${params.toString()}`, {
    method: "GET",
  });
};
