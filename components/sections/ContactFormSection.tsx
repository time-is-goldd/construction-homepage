import ContactForm from "@/components/contact/ContactForm";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactFormSection() {
  return (
    <Section tone="white">
      <SectionHeading>문의하기</SectionHeading>
      <p className="mt-2 text-[15px] text-neutral-600 md:text-base">
        <span className="text-status-error">*</span> 표시는 필수 입력
        항목입니다.
      </p>
      <ContactForm />
    </Section>
  );
}
