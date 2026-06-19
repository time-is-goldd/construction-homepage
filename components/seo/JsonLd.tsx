// JSON-LD 구조화 데이터를 <script type="application/ld+json">로 렌더링하는
// 공용 컴포넌트. 데이터는 항상 서버에서 생성한 객체(lib/seo/structured-data.ts)이므로
// 사용자 입력이 섞이지 않아 JSON.stringify 결과를 그대로 출력해도 안전하다.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
