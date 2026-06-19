import Link from "next/link";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { BUSINESS_CATEGORIES } from "@/lib/constants";

export default function BusinessPreviewSection() {
  return (
    <Section tone="white">
      <SectionHeading>사업분야</SectionHeading>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {BUSINESS_CATEGORIES.map((category) => (
          <Link key={category.slug} href="/business" className="block">
            <Card hoverable className="h-full">
              <span aria-hidden="true" className="text-3xl">
                {category.icon}
              </span>
              <h3 className="mt-3 text-[20px] leading-[1.4] font-semibold text-neutral-900 md:text-[20px]">
                {category.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
                {category.shortDescription}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
