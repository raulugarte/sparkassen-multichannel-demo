import demo from "@/content/demo.json";

export type ImageRef = { _path?: string; _dynamicUrl?: string } | null;
export type RelatedProduct = { produktbild?: ImageRef; _path: string; title: string; description?: { plaintext?: string }; kategorie?: string; ctaLabel?: string };
export type Advisor = { beraterbild?: ImageRef; _path: string; fullName: string; position?: string; email?: string; telefon?: string; fachgebiete?: string[] };
export type Campaign = { _path: string; title: string; description?: { plaintext?: string }; gueltigVon?: string; gueltigBis?: string; bedingungen?: { plaintext?: string } };
export type Product = { produktbild?: ImageRef; slug: string; title: string; category: string; description: string; cta: string; icon: string; highlights: string[]; targetAudience?: string; relatedProducts: RelatedProduct[]; ansprechpartner: Advisor | null; aktionen: Campaign[] };
export type Content = { hero: typeof demo.hero; products: Product[]; source: "demo" | "aem"; warning?: string };

type GraphProduct = { _variations?: string[]; produktbild?: ImageRef; _path: string; title: string; description?: { plaintext?: string }; highlights?: string[]; targetAudience?: string; ctaLabel?: string; kategorie?: string; relatedProducts?: RelatedProduct[]; ansprechpartner?: Advisor | null; aktionen?: Campaign[] };
type GraphResponse = { data?: { sparkasseProduktList?: { items?: GraphProduct[] } }; errors?: Array<{ message: string }> };
const query = `query SparkassenMultiChannel {
  sparkasseProduktList {
    items {
      _path title description { plaintext } highlights targetAudience ctaLabel kategorie
      produktbild { ... on ImageRef { _path _dynamicUrl } }
      relatedProducts { ... on SparkasseProduktModel { _path title description { plaintext } kategorie ctaLabel produktbild { ... on ImageRef { _path _dynamicUrl } } } }
      ansprechpartner { ... on SparkasseBeraterModel { _path fullName position email telefon fachgebiete beraterbild { ... on ImageRef { _path _dynamicUrl } } } }
      aktionen { ... on SparkasseAktionModel { _path title description { plaintext } gueltigVon gueltigBis bedingungen { plaintext } } }
    }
  }
}`;
const iconBySlug: Record<string,string> = { girokonto:"▣", kreditkarte:"▤", privatkredit:"◇", baufinanzierung:"⌂", tagesgeldkonto:"↗", depot:"◈" };
function campaignIsCurrent(c: Campaign): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return (!c.gueltigVon || c.gueltigVon <= today) && (!c.gueltigBis || c.gueltigBis >= today);
}
function fallback(): Content {
  return { hero: demo.hero, source: "demo", products: demo.products.map(p => ({ ...p, highlights: [], relatedProducts: [], ansprechpartner: null, aktionen: [] })) };
}
function mapProduct(p: GraphProduct): Product {
  const slug = p._path.split("/").pop()?.replace(/^sparkassen-/, "") || "produkt";
  return {
    produktbild: p.produktbild, slug, title: p.title, category: p.kategorie || "Bankprodukte", description: p.description?.plaintext || "",
    cta: p.ctaLabel || "Mehr erfahren", icon: iconBySlug[slug] || "◆",
    highlights: p.highlights || [], targetAudience: p.targetAudience,
    relatedProducts: p.relatedProducts || [], ansprechpartner: p.ansprechpartner || null,
    aktionen: (p.aktionen || []).filter(campaignIsCurrent),
  };
}
export async function getContent(): Promise<Content> {
  const endpoint = process.env.AEM_GRAPHQL_ENDPOINT;
  const token = process.env.AEM_AUTH_TOKEN;
  if (!endpoint || !token) return { ...fallback(), warning: "AEM GraphQL ist noch nicht konfiguriert." };
  try {
    const response = await fetch(endpoint, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query }), next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json() as GraphResponse;
    if (result.errors?.length) throw new Error(result.errors.map(e=>e.message).join("; "));
    const items = result.data?.sparkasseProduktList?.items;
    if (!Array.isArray(items) || !items.length) throw new Error("GraphQL lieferte keine Produkte");
    return { hero: demo.hero, products: items.filter(p=>p._path.startsWith("/content/dam/sparkasse/produkte/")).map(mapProduct), source: "aem" };
  } catch (error) {
    console.error("AEM GraphQL request failed", error);
    return { ...fallback(), warning: "AEM nicht erreichbar; lokale Demodaten werden angezeigt." };
  }
}


// The featured card alone requests the mobile AEM variation.
// Other recommendations continue to use master product content.
const featuredMobileQuery = `query SparkassenMobileFeatured {
  sparkasseProduktList(variation: "mobile") {
    items {
      _path _variations title description { plaintext } highlights targetAudience ctaLabel kategorie
      produktbild { ... on ImageRef { _path _dynamicUrl } }
      relatedProducts { ... on SparkasseProduktModel { _path title description { plaintext } kategorie ctaLabel produktbild { ... on ImageRef { _path _dynamicUrl } } } }
      ansprechpartner { ... on SparkasseBeraterModel { _path fullName position email telefon fachgebiete beraterbild { ... on ImageRef { _path _dynamicUrl } } } }
      aktionen { ... on SparkasseAktionModel { _path title description { plaintext } gueltigVon gueltigBis bedingungen { plaintext } } }
    }
  }
}`;

export async function getMobileContent(master?: Content): Promise<Content> {
  const base = master ?? await getContent();
  if (base.source !== "aem") return base;
  const endpoint = process.env.AEM_GRAPHQL_ENDPOINT;
  const token = process.env.AEM_AUTH_TOKEN;
  if (!endpoint || !token) return base;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: featuredMobileQuery }),
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json() as GraphResponse;
    if (result.errors?.length) throw new Error(result.errors.map(e => e.message).join("; "));
    const featured = result.data?.sparkasseProduktList?.items?.find(p =>
      p._path === "/content/dam/sparkasse/produkte/sparkassen-baufinanzierung"
    );
    if (!featured) return base;
    const variant = mapProduct(featured);
    return { ...base, products: base.products.map(p => p.slug === variant.slug ? variant : p) };
  } catch (error) {
    console.error("AEM mobile featured variation request failed", error);
    return base;
  }
}
