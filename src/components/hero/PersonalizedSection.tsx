import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function PersonalizedSection() {
  return (
    <Section className="bg-muted/30 py-10 md:py-14">
      <Container>
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-6">
          <h2 className="big-caslon text-2xl font-medium text-foreground sm:text-3xl md:text-4xl">
            Make It Yours
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Personalize your piece with engraving, birthstones, or our Color
            Bar®. Create something one-of-a-kind for you or someone you love.
          </p>
          <Link
            href="/personalization"
            className="inline-flex items-center justify-center rounded-md border border-foreground bg-transparent px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Explore Personalization
          </Link>
        </div>
      </Container>
    </Section>
  );
}
