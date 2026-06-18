import Breadcrumb from "@/components/ui/Breadcrumb";
import Container from "@/components/ui/Container";

type SubHeroProps = {
  title: string;
  breadcrumbItems: { label: string; href?: string }[];
};

export default function SubHero({ title, breadcrumbItems }: SubHeroProps) {
  return (
    <section className="bg-brand-900">
      <Container className="flex flex-col gap-3 py-12 text-white md:py-16">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-[28px] leading-[1.3] font-bold tracking-[-0.02em] md:text-[40px]">
          {title}
        </h1>
      </Container>
    </section>
  );
}
