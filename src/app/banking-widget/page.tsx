import { getContent } from "@/lib/content";
import { Banking, PageShell } from "@/components/Views";
export const revalidate = 60;
export default async function Widget() {
  const data = await getContent();
  return <PageShell><main className="detail-page banking-detail-page"><span className="eyebrow">KANAL 03 · ONLINE-BANKING</span><h1>Online-Banking</h1><div className="detail-banking"><Banking data={data}/></div></main></PageShell>;
}
