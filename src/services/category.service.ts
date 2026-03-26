import { apiFetch } from "@/lib/api";

export const getCategories = async () => {
  const res = await apiFetch("/categories/tree", {
    method: "GET",
  });
  return res.data;
};

export const getCategoryName = async () => {
  const level = 1;
  const res = await apiFetch(`/categories/all/${level}`, {
    method: "GET",
  });
  return res.data;
};
