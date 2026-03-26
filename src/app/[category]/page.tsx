import { getCategories } from "@/services/category.service";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@/components/product/Product";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categories = await getCategories();

  const categoryData = categories.find((cat: any) => cat.slug === category);
  if (!categoryData) return notFound();

  return (
    <>
      <Container className="py-10">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link className="hover:text-black" href="/">
            Home
          </Link>
          <span>/</span>
          <Link className="hover:text-black" href={categoryData.url}>
            {categoryData.name}
          </Link>
        </nav>

        <h1 className="text-3xl font-semibold mb-2">{categoryData.name}</h1>
        {categoryData.metaDescription && (
          <p className="text-gray-500 mb-8">{categoryData.metaDescription}</p>
        )}

        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categoryData.children?.map((sub: any) => (
            <Link
              key={sub._id}
              href={sub.url}
              className="group py-2 hover:text-blue-500 text-center border border-black"
            >
              <p className="font-medium text-sm">{sub.name}</p>
            </Link>
          ))}
        </div>
      </Container>
      <div className="min-h-100 mt-10 text-gray-400">
        <Product categoryId={categoryData._id} />
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const categories = await getCategories();
  const cat = categories.find((c: any) => c.slug === category);

  return {
    title: cat?.metaTitle ?? cat?.name,
    description: cat?.metaDescription,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat: any) => ({ category: cat.slug }));
}
