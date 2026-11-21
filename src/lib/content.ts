import demo from "@/content/demo.json";
export type Product = (typeof demo.products)[number];
export type Content = { hero: typeof demo.hero; products: Product[]; source: "demo" | "aem" };
const BASE = process.env.AEM_AUTHOR_URL;
const TOKEN = process.env.AEM_AUTH_TOKEN;
const ids: Record<string, string | undefined> = {
  girokonto: process.env.AEM_FRAGMENT_GIROKONTO_ID,
  geldanlage: process.env.AEM_FRAGMENT_GELDANLAGE_ID,
  privatkredit: process.env.AEM_FRAGMENT_PRIVATKREDIT_ID,
  baufinanzierung: process.env.AEM_FRAGMENT_BAUFINANZIERUNG_ID,
};
const value = (v: unknown): string | undefined => {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return value(o.value) || value(o.master);
  }
  return undefined;
};
async function loadFragment(id: string, variation: string) {
  if (!BASE || !TOKEN) return null;
  const url = `${BASE.replace(/\/$/, "")}/adobe/sites/cf/fragments/${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" }, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`AEM fragment response ${res.status}`);
  const body = await res.json() as Record<string, unknown>;
  const fields = (body.fields ?? body.elements ?? {}) as Record<string, unknown>;
  const variations = (body.variations ?? {}) as Record<string, Record<string, unknown>>;
  return { ...fields, ...(variations[variation] ?? {}) };
}
export async function getContent(variation = "master"): Promise<Content> {
  const fallback: Content = { ...demo, source: "demo" };
  if (!BASE || !TOKEN || !Object.values(ids).some(Boolean)) return fallback;
  try {
    const products = await Promise.all(demo.products.map(async p => {
      const id = ids[p.slug]; if (!id) return p;
      const f = await loadFragment(id, variation); if (!f) return p;
      return { ...p, title: value(f.title) ?? p.title, description: value(f.shortDescription) ?? value(f.description) ?? p.description, cta: value(f.ctaLabel) ?? p.cta };
    }));
    return { hero: demo.hero, products, source: "aem" };
  } catch (error) {
    console.error("AEM request failed; using separate Sparkassen demo data", error);
    return fallback;
  }
}
