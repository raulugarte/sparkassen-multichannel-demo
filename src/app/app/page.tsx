import { getMobileContent } from "@/lib/content";
import { Mobile, PageShell } from "@/components/Views";
export const revalidate = 60;
export default async function App() {
  const data = await getMobileContent();
  return <PageShell><main className="detail-page mobile-detail-page"><span className="eyebrow">KANAL 02 · APP-MOCKUP</span><h1>Mobile Banking</h1><div className="mobile-large"><Mobile data={data} /></div></main></PageShell>;
}
