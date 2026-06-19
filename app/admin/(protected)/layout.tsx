import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";

// middleware.ts가 1차로 /admin/* 접근을 보호하지만, 미들웨어 우회 가능성에 대비해
// 레이아웃에서도 동일하게 세션을 검증한다 (defense in depth, ARCHITECTURE.md 4-3).
export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end border-b border-neutral-200 bg-white px-6 text-[14px] text-neutral-600">
          {user.email}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
