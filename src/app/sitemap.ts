import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "./actions/order.server";

const SITE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

async function getProduct() {
  try {
    const res = await getProducts();

    return res.products || [];
  } catch (error) {
    return [];
  }
}

export async function getCategorie() {
  const categories = await getCategories();
  return categories.map((cat: any) => ({ category: cat.slug }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const products = await getProduct();

  const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categories = await getCategorie();

  const categoriesRoutes: MetadataRoute.Sitemap = categories.map(
    (cat: any) => ({
      url: `${baseUrl}/${cat.url}`,
      lastModified: new Date(cat.updatedAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...productRoutes, ...categoriesRoutes];
}
