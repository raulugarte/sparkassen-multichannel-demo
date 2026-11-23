
import {
  getContent,
  getMobileContent,
} from "@/lib/content";

import {
  Mobile,
  PageShell,
} from "@/components/Views";

export const revalidate = 60;

export default async function App() {
  // Master-Content aus AEM GraphQL laden
  const master = await getContent();

  // Mobile-Variation für das hervorgehobene Produkt laden.
  // Alle übrigen Produkte bleiben im Master.
  const data = await getMobileContent(master);

  return (
    <PageShell>
      <main className="detail-page mobile-detail-page">
        <span className="eyebrow">
          KANAL 02 · APP-MOCKUP
        </span>

        <h1>Mobile Banking</h1>

        <div className="mobile-large">
          <Mobile data={data} />
        </div>
      </main>
    </PageShell>
  );
}
