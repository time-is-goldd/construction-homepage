import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `관리자 로그인 | ${COMPANY_NAME}`,
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[400px] rounded-xl border border-neutral-200 bg-white p-8 shadow-[0_6px_16px_rgba(15,28,48,0.08)]">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo/logo-full.png"
            alt={COMPANY_NAME}
            width={180}
            height={69}
            className="h-8 w-auto"
          />
          <h1 className="text-lg font-semibold text-neutral-900">
            관리자 로그인
          </h1>
        </div>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
