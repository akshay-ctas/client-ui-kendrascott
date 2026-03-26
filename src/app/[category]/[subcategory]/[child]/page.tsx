import { getCategories } from "@/services/category.service";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@/components/product/Product";

interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
    child: string;
  }>;
}

export default async function ChildCategoryPage({ params }: Props) {
  const { category, subcategory, child } = await params;

  const categories = await getCategories();

  const categoryData = categories.find((cat: any) => cat.slug === category);
  if (!categoryData) return notFound();

  const subcategoryData = categoryData.children?.find(
    (sub: any) => sub.slug === subcategory,
  );
  if (!subcategoryData) return notFound();

  const childData = subcategoryData.children?.find(
    (c: any) => c.slug === child,
  );
  if (!childData) return notFound();

  return (
    <div>
      <Container className="py-10">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={categoryData.url}>{categoryData.name}</Link>
          <span>/</span>
          <Link href={subcategoryData.url}>{subcategoryData.name}</Link>
          <span>/</span>
          <span className="text-black">{childData.name}</span>
        </nav>

        <h1 className="text-3xl font-semibold mb-2">{childData.name}</h1>

        {childData.metaDescription && (
          <p className="text-gray-500 mb-8">{childData.metaDescription}</p>
        )}
      </Container>

      <div className="min-h-100 text-gray-400">
        <Product categoryId={childData._id} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { category, subcategory, child } = await params;

  const categories = await getCategories();

  const cat = categories.find((c: any) => c.slug === category);
  const sub = cat?.children?.find((s: any) => s.slug === subcategory);
  const childCat = sub?.children?.find((c: any) => c.slug === child);

  return {
    title: childCat?.metaTitle ?? childCat?.name,
    description: childCat?.metaDescription,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();

  const paths: {
    category: string;
    subcategory: string;
    child: string;
  }[] = [];

  categories.forEach((cat: any) => {
    cat.children?.forEach((sub: any) => {
      sub.children?.forEach((child: any) => {
        paths.push({
          category: cat.slug,
          subcategory: sub.slug,
          child: child.slug,
        });
      });
    });
  });

  return paths;
}
