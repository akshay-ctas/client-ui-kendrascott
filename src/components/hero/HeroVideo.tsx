import Link from "next/link";

export default function HeroVideo() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-video lg:aspect-[21/9]">
      <video
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Valentine's Day celebration"
      >
        <source src="/galentinesVID_d.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      <div className="absolute bottom-6 left-4 right-4 text-end text-white sm:bottom-12 sm:right-12 sm:left-auto md:bottom-16 md:right-16 lg:bottom-20 lg:right-20">
        <h1 className="big-caslon mb-2 text-3xl font-sans leading-tight sm:mb-3 sm:text-4xl md:text-5xl lg:text-6xl">
          Love Is Everywhere
        </h1>
        <p className="mb-4 text-sm sm:mb-6 sm:text-base">
          Celebrate Valentine&apos;s Day with Our Best-Selling Gifts
        </p>
        <Link
          href="/bestsellers"
          className="inline-block border-b border-white pb-0.5 text-sm font-medium transition-opacity hover:opacity-90 sm:text-base"
        >
          Shop Best Selling Gifts
        </Link>
      </div>
    </div>
  );
}
