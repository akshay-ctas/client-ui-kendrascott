import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@/components/product/Product";
import { getCategories } from "@/app/actions/order.server";

interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}

export default async function SubcategoryPage({ params }: Props) {
  const { category, subcategory } = await params;
  const categories = await getCategories();

  const categoryData = categories.find((cat: any) => cat.slug === category);
  if (!categoryData) return notFound();

  const subcategoryData = categoryData.children?.find(
    (sub: any) => sub.slug === subcategory,
  );
  if (!subcategoryData) return notFound();

  return (
    <div>
      <Container className="py-10">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href={categoryData.url} className="hover:text-black">
            {categoryData.name}
          </Link>
          <span>/</span>
          <span className="text-black">{subcategoryData.name}</span>
        </nav>

        <h1 className="text-3xl font-semibold mb-2">{subcategoryData.name}</h1>
        {subcategoryData.metaDescription && (
          <p className="text-gray-500 mb-8">
            {subcategoryData.metaDescription}
          </p>
        )}

        {subcategoryData.children?.length > 0 && (
          <div className="flex gap-3 mb-8 flex-wrap">
            {subcategoryData.children.map((sub: any) => (
              <Link
                key={sub._id}
                href={sub.url}
                className="px-4 py-2 border rounded-full text-sm hover:bg-black hover:text-white transition"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </Container>
      <div className="min-h-100  text-gray-400">
        <Product categoryId={subcategoryData._id} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { category, subcategory } = await params;
  const categories = await getCategories();
  const cat = categories.find((c: any) => c.slug === category);
  const sub = cat?.children?.find((s: any) => s.slug === subcategory);

  return {
    title: sub?.metaTitle ?? sub?.name,
    description: sub?.metaDescription,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  const paths: { category: string; subcategory: string }[] = [];

  categories.forEach((cat: any) => {
    cat.children?.forEach((sub: any) => {
      paths.push({ category: cat.slug, subcategory: sub.slug });
    });
  });

  return paths;
}
