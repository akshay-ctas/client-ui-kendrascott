import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";

const PRODUCTS = [
  {
    id: 1,
    name: "Gift Starting at",
    price: "$50",
    image: "/new-arrivals/giftsstartingat.avif",
    href: "/gifts",
  },
  {
    id: 2,
    name: "Valentine's Gift Guide",
    price: null,
    image: "/new-arrivals/giftguideskinny.avif",
    href: "/valentines-guide",
  },
] as const;

export default function NewArrivals() {
  return (
    <Section className="py-2 md:py-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4">
        {PRODUCTS.map(({ id, name, price, image, href }) => (
          <Link
            key={id}
            href={href}
            className="group relative flex min-h-50 items-center justify-center overflow-hidden bg-gray-100 text-center sm:min-h-70 md:min-h-80"
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30" />
            <div className="relative z-10 px-4">
              <h2 className="text-2xl font-semibold text-white drop-shadow sm:text-3xl md:pb-4 md:text-4xl">
                {name} {price ?? ""}
              </h2>
              <span className="inline-block text-base font-semibold text-white underline underline-offset-4 sm:text-lg">
                Shop now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
