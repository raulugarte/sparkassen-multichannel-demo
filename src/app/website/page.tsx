import Link from "next/link";
import { getContent } from "@/lib/content";
import { PageShell, AssetImage } from "@/components/Views";

export const revalidate = 60;

export default async function WebsitePage() {
  const data = await getContent();
  const featured = data.products.find(p => p.slug === "baufinanzierung") || data.products[0];
  return <PageShell><main className="web-redesign">
    <section className="web-featured">
      <AssetImage image={featured?.produktbild} alt="Bildmotiv zum hervorgehobenen Produkt" className="web-featured-image" />
      <div className="web-featured-overlay" />
      <div className="web-featured-copy"><span className="web-featured-kicker">{featured?.category || "Finanzlösungen"}</span><h1>{featured?.title || "Unsere Finanzlösungen"}</h1><p>{featured?.description}</p><Link className="web-featured-cta" href={`/website/produkte/${featured?.slug || "baufinanzierung"}`}>{featured?.cta || "Mehr erfahren"} <span aria-hidden="true">→</span></Link></div>
    </section>
    <section className="web-products" id="angebote"><div className="web-products-heading"><span className="eyebrow">UNSERE PRODUKTE</span><h2>Unsere Finanzlösungen.</h2><p>Entdecken Sie unser Angebot – passend zu Ihren Zielen und Lebensphasen.</p></div>
      <div className="web-card-grid">{data.products.map(p=><Link className="web-card" href={`/website/produkte/${p.slug}`} key={p.slug}><AssetImage image={p.produktbild} alt={`Motiv zu ${p.title}`} className="web-card-image"/><div className="web-card-copy"><span className="eyebrow">{p.category}</span><h3>{p.title}</h3><p>{p.description}</p><span className="web-card-link">Mehr erfahren <span aria-hidden="true">→</span></span></div></Link>)}</div>
    </section>
  </main></PageShell>;
}
