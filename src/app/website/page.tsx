import Link from "next/link";
import { getContent } from "@/lib/content";
import { PageShell, ProductCard } from "@/components/Views";

export const revalidate = 60;

export default async function WebsitePage() {
  const data = await getContent();
  return <PageShell><main className="website-page">
    <div className="website-utility"><span>Privatkunden</span><span>Geschäftskunden</span><span>Service & Kontakt</span><span className="demo-note">DEMO · Kein echter Bankauftritt</span></div>
    <section className="website-banner"><div className="website-banner-inner">
      <span className="website-kicker">{data.hero.eyebrow}</span>
      <h1>{data.hero.title}</h1><p>{data.hero.description}</p>
      <a className="website-primary-cta" href="#angebote">Angebote entdecken <span aria-hidden="true">→</span></a>
    </div></section>
    <section className="website-content" id="angebote"><div className="website-section-heading"><span className="eyebrow">UNSERE THEMEN</span><h2>Finanzlösungen für Ihren Alltag.</h2><p>Entdecken Sie unsere Beispielangebote. Alle Angaben dienen ausschließlich der Demonstration.</p></div>
      <div className="website-product-grid">{data.products.map(p=><ProductCard key={p.slug} p={p}/>)}</div>
    </section>
    <section className="website-info"><div><span className="eyebrow">HEADLESS CONTENT</span><h2>Einmal gepflegt. Überall verfügbar.</h2><p>Diese Website stellt die Master-Inhalte der Sparkassen-Multi-Channel-Demo dar. Die Mobile-App und das Online-Banking verwenden dieselben Master-Inhalte in einer anderen Darstellung.</p><p className="website-source">Content-Quelle: {data.source === "aem" ? "AEM GraphQL (Live)" : "Lokale Sparkassen-Demodaten"}</p><Link href="/channels" className="website-secondary-link">Zur Multi-Channel-Übersicht →</Link></div></section>
  </main></PageShell>;
}
