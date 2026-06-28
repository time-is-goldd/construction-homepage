"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { COMPANY_NAME, PHONE_DISPLAY, PHONE_TEL } from "@/lib/constants";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

// TODO: WIREFRAME.md 기준 구조. 실제 라우트는 Phase 2에서 페이지 구현 시 확정.
const NAV_ITEMS: NavItem[] = [
  {
    label: "회사소개",
    children: [
      { label: "인사말", href: "/about" },
      { label: "회사개요", href: "/about/company" },
    ],
  },
  { label: "사업분야", href: "/business" },
  { label: "시공사례", href: "/works" },
  { label: "시공실적", href: "/performance" },
  { label: "고객문의", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ease-out motion-reduce:transition-none ${
        scrolled ? "shadow-[0_2px_8px_rgba(15,28,48,0.08)]" : ""
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex self-stretch items-center py-1.5">
          <Image
            src="/images/logo/logo-header.jpg"
            alt={COMPANY_NAME}
            width={6485}
            height={2477}
            priority
            className="h-full w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative h-full">
                <button
                  type="button"
                  className="hover:text-brand-700 flex h-20 items-center text-[15px] font-medium text-neutral-800"
                >
                  {item.label}
                </button>
                <div className="invisible absolute top-full left-0 min-w-[160px] rounded-lg border border-neutral-200 bg-white py-2 opacity-0 shadow-[0_6px_16px_rgba(15,28,48,0.12)] transition-opacity duration-150 ease-out group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="hover:text-brand-700 block px-4 py-2 text-[15px] text-neutral-800 hover:bg-neutral-50"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href as string}
                className="hover:text-brand-700 text-[15px] font-medium text-neutral-800"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href={PHONE_TEL}
            className="hover:text-brand-700 flex items-center gap-2 text-[15px] font-medium text-neutral-800"
          >
            <span aria-hidden="true">📞</span>
            {PHONE_DISPLAY}
          </a>
          <Button href="/contact" variant="cta" size="md">
            문의하기
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-brand-700 flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
        >
          <span aria-hidden="true" className="text-2xl">
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>
      </Container>

      <div
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-[250ms] ease-in-out motion-reduce:transition-none md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-nav-panel"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[320px] flex-col bg-white shadow-[0_6px_16px_rgba(15,28,48,0.12)] transition-transform duration-[250ms] ease-in-out motion-reduce:transition-none md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
          {NAV_ITEMS.flatMap((item) =>
            item.children
              ? item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-50"
                  >
                    {item.label} · {child.label}
                  </Link>
                ))
              : [
                  <Link
                    key={item.href}
                    href={item.href as string}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-50"
                  >
                    {item.label}
                  </Link>,
                ],
          )}
          <a
            href={PHONE_TEL}
            className="mt-2 rounded-lg px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-50"
          >
            📞 {PHONE_DISPLAY}
          </a>
        </nav>
        <div className="border-t border-neutral-200 p-4">
          <Button
            href="/contact"
            variant="cta"
            size="lg"
            className="w-full"
            onClick={() => setMenuOpen(false)}
          >
            문의하기
          </Button>
        </div>
      </div>
    </header>
  );
}
