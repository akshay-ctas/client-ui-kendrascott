const SITE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

type ProductImage = {
  url: string;
  isPrimary?: boolean;
};

type ProductVariant = {
  sku?: string;
  price?: number;
  stock?: number;
};

type ProductData = {
  title: string;
  description?: string;
  slug: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  price?: number;
  status?: string;
  averageRating?: number;
  reviewCount?: number;
};

export function buildProductSchema(product: ProductData) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    `${SITE_URL}/og-image.jpg`;

  const defaultVariant =
    product.variants?.find((variant) => (variant.stock ?? 0) > 0) ||
    product.variants?.[0];

  const price = defaultVariant?.price ?? product.price ?? 0;
  const stock = defaultVariant?.stock ?? 0;
  const sku = defaultVariant?.sku;

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || "",
    image: [primaryImage],
    sku,
    brand: {
      "@type": "Brand",
      name: "Kendra Scott Clone",
    },
    url: `${SITE_URL}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: String(price),
      availability:
        stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return schema;
}
