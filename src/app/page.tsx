import dynamic from "next/dynamic";
import HeroVideo from "@/components/hero/HeroVideo";

const HeroCategory = dynamic(() => import("@/components/hero/HeroCategory"), {
  ssr: true,
});

const HeroGift = dynamic(() => import("@/components/hero/HeroGift"), {
  ssr: true,
});

const NewArrivals = dynamic(() => import("@/components/hero/NewArrivals"), {
  ssr: true,
});

const PersonalizedSection = dynamic(
  () => import("@/components/hero/PersonalizedSection"),
  { ssr: true },
);

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroVideo />
      <HeroCategory />
      <HeroGift />
      <NewArrivals />
      <PersonalizedSection />
    </main>
  );
}
