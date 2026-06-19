import Card from "@/components/ui/Card";

// 신규문의/처리중/완료/시공사례 통계는 Phase 4(이미지·시공사례)·Phase 5(문의)에서
// 실제 Supabase 데이터로 연동된다. 지금은 실데이터가 없어 "-"로 표시한다(0건으로 단정하지 않음).
const STATS = [
  { label: "신규 문의", value: "-" },
  { label: "처리중 문의", value: "-" },
  { label: "완료 문의", value: "-" },
  { label: "등록된 시공사례", value: "-" },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">대시보드</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <p className="text-[13px] text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <p className="text-[15px] text-neutral-600">
          최근 문의 목록과 통계는 Phase 5(문의 기능)에서 연동됩니다.
        </p>
      </Card>
    </div>
  );
}
