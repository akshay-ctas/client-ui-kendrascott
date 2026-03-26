import Link from "next/link";

export type BreadcrumbItem = {
  name: string;
  href: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Link href="/">Home</Link>

      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <span>/</span>

          {index === items.length - 1 ? (
            <span className="text-black">{item.name}</span>
          ) : (
            <Link href={item.href} className="hover:text-black">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
