"use client";

import { Container } from "../ui/Container";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";

export default function MegaContent({ active }: { active: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategories,
  });

  const activeCategory = data?.find(
    (cat: any) =>
      cat.name?.toLowerCase().trim() === active?.toLowerCase().trim(),
  );

  if (isLoading) return null;
  if (!activeCategory) return null;

  return (
    <div className="py-8">
      <Container>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg">{activeCategory.name}</h3>

            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {activeCategory.children?.map((child: any) => (
                <li key={child._id}>
                  <Link
                    href={child.url}
                    className="hover:text-blue-500 transition"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
