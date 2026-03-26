import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

const CATEGORIES = [
  {
    id: 1,
    image: "/category-image/necklaces.avif",
    name: "Necklaces",
    href: "/jewelry/necklaces",
  },
  {
    id: 2,
    image: "/category-image/bracelets.avif",
    name: "Bracelets",
    href: "/jewelry/bracelets",
  },
  {
    id: 3,
    image: "/category-image/earrings.avif",
    name: "Earrings",
    href: "/jewelry/earrings",
  },
  {
    id: 4,
    image: "/category-image/rings.avif",
    name: "Rings",
    href: "/jewelry/rings",
  },
  {
    id: 5,
    image: "/category-image/color-bar.avif",
    name: "Color Bar",
    href: "/jewelry/color-bar",
  },
  {
    id: 6,
    image: "/category-image/bestsellers.avif",
    name: "Bestsellers",
    href: "/jewelry/bestsellers",
  },
] as const;

export default function HeroCategory() {
  return (
    <Section className="py-6 md:py-8">
      <Container>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {CATEGORIES.map(({ id, image, name, href }) => (
            <Link
              key={id}
              href={href}
              className="group flex flex-col items-center text-center transition-transform hover:scale-[1.02]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-opacity group-hover:opacity-95"
                />
              </div>
              <p className="big-caslon mt-3 text-base font-medium sm:text-lg md:pb-1 lg:text-xl">
                {name}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
