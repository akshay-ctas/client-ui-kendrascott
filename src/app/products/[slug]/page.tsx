import { SITE_URL } from "@/app/layout";
import ProductDetails from "@/components/product/ProductDetails";
import { buildProductSchema } from "@/lib/buildProductSchema";
import { getProductBySlug } from "@/services/product.service";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}
export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) return;

  const res = await getProductBySlug(slug);

  const product = res?.data;
  const productSchema = buildProductSchema(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <ProductDetails slug={slug} />
    </>
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProductBySlug(slug);

  const product = res?.data;

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product does not exist.",
    };
  }

  const title = product.metaTitle || product.title;
  const description =
    product.metaDescription ||
    product.description?.slice(0, 160) ||
    "Explore this product.";

  const image =
    product.images?.find((img: any) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    `${SITE_URL}/og-image.jpg`;

  return {
    title,
    description,

    keywords: product.tags || [],

    alternates: {
      canonical: `/product/${product.slug}`,
    },

    openGraph: {
      title,
      description,
      url: `/product/${product.slug}`,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
