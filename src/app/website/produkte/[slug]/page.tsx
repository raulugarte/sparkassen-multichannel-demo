import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { PageShell, AssetImage } from "@/components/Views";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };
export default async function ProductDetail({params}:Props) {
  const {slug} = await params;
  const data = await getContent();
  const p = data.products.find(x=>x.slug===slug);
  if (!p) notFound();
  return <PageShell><main className="product-detail">
    <nav className="product-breadcrumb" aria-label="Brotkrumennavigation"><Link href="/website">Website</Link><span>›</span><Link href="/website#angebote">Finanzlösungen</Link><span>›</span><span>{p.title}</span></nav>
    <section className="product-detail-hero"><div className="product-detail-intro"><span className="eyebrow">{p.category}</span><h1>{p.title}</h1><p>{p.description}</p><a className="web-featured-cta" href="#kontakt">{p.cta} <span aria-hidden="true">→</span></a></div><div className="product-detail-visual"><AssetImage image={p.produktbild} alt={`Produktmotiv ${p.title}`} className="product-detail-image"/></div></section>
    <section className="product-benefits"><h2>Ihre Vorteile auf einen Blick.</h2><div className="benefit-grid">{p.highlights.map((h,i)=><div className="benefit" key={`${i}-${h}`}><span aria-hidden="true">✓</span><p>{h}</p></div>)}</div></section>
    <section className="product-detail-columns"><div className="detail-panel"><span className="eyebrow">PRODUKTINFORMATIONEN</span><h2>Das Wichtigste im Überblick.</h2><p>{p.description}</p>{p.targetAudience && <p><strong>Geeignet für:</strong> {p.targetAudience}</p>}{p.highlights.length>0&&<ul>{p.highlights.map(h=><li key={h}>{h}</li>)}</ul>}</div>
      <div className="detail-side"><div className="detail-panel" id="kontakt"><span className="eyebrow">PERSÖNLICHE BERATUNG</span><h2>Ihre Ansprechperson</h2>{p.ansprechpartner?<><div className="detail-advisor"><AssetImage image={p.ansprechpartner.beraterbild} alt={`Bild zu ${p.ansprechpartner.fullName}`} className="detail-advisor-image"/><div><strong>{p.ansprechpartner.fullName}</strong><p>{p.ansprechpartner.position}</p></div></div>{p.ansprechpartner.telefon&&<p>Telefon: <a href={`tel:${p.ansprechpartner.telefon}`}>{p.ansprechpartner.telefon}</a></p>}{p.ansprechpartner.email&&<p>E-Mail: <a href={`mailto:${p.ansprechpartner.email}`}>{p.ansprechpartner.email}</a></p>}</>:<p>Persönliche Beratung auf Anfrage.</p>}</div>
      {p.aktionen.length>0&&<div className="detail-panel detail-campaign"><span className="eyebrow">AKTUELLE AKTION</span>{p.aktionen.map(a=><div key={a._path}><h3>{a.title}</h3><p>{a.description?.plaintext}</p>{a.gueltigBis&&<small>Gültig bis {new Date(`${a.gueltigBis}T12:00:00Z`).toLocaleDateString("de-DE",{timeZone:"UTC"})}</small>}{a.bedingungen?.plaintext&&<details><summary>Bedingungen</summary><p>{a.bedingungen.plaintext}</p></details>}</div>)}</div>}</div></section>
    {p.relatedProducts.length>0&&<section className="related-section"><h2>Weitere Produkte, die zu Ihnen passen.</h2><div className="related-grid">{p.relatedProducts.map(r=>{const relatedSlug=r._path.split("/").pop()?.replace(/^sparkassen-/,"");return <Link href={`/website/produkte/${relatedSlug}`} className="related-card" key={r._path}><AssetImage image={r.produktbild} alt={`Motiv zu ${r.title}`} className="related-image"/><div><strong>{r.title}</strong><p>{r.description?.plaintext}</p></div><span aria-hidden="true">→</span></Link>})}</div></section>}
  </main></PageShell>;
}
