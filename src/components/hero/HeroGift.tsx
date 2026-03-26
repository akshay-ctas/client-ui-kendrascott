import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function HeroGift() {
  return (
    <div
      className="py-6 text-center text-white md:py-8"
      style={{ backgroundColor: "var(--brand-burgundy)" }}
    >
      <Container className="flex flex-col items-center">
        <h2 className="big-caslon mb-2 text-2xl font-normal italic leading-tight sm:mb-3 sm:text-3xl md:text-4xl">
          Need Your Gift ASAP?
        </h2>
        <p className="mb-3 max-w-2xl text-sm sm:text-base">
          Order with next-day shipping for just $15.95. Ends today 2/11 at 11:59
          p.m. PT. Excludes Color Bar®, and engraving.
        </p>
        <Link
          href="/gifts"
          className="text-lg font-medium underline underline-offset-4 transition-opacity hover:opacity-90"
        >
          Shop Gifts
        </Link>
      </Container>
    </div>
  );
}
