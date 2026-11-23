"use client";

import { useState } from "react";
import type { ImageRef } from "@/lib/content";

const DELIVERY_HOST = "delivery-p130407-e1279066.adobeaemcloud.com";
const DELIVERY_ORIGIN = `https://${DELIVERY_HOST}`;
const ASSET_PREFIX = "/content/dam/dsv/images/";

// Use the URL returned by AEM GraphQL. Never synthesize a delivery URL
// from the Author hostname or a DAM path.
function deliveryUrl(image?: ImageRef): string | null {
  if (!image?._dynamicUrl) return null;
  try {
    const url = new URL(image._dynamicUrl, DELIVERY_ORIGIN);
    if (url.protocol !== "https:" || url.hostname !== DELIVERY_HOST) return null;
    // Relative URLs must be delivery API paths, not Author DAM paths.
    if (!url.pathname.startsWith("/adobe/assets/")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function authorFallback(image?: ImageRef): string | null {
  if (!image?._path?.startsWith(ASSET_PREFIX)) return null;
  return `/api/asset?path=${encodeURIComponent(image._path)}`;
}

export function AssetImage({ image, alt, className = "" }: { image?: ImageRef; alt: string; className?: string }) {
  const delivery = deliveryUrl(image);
  const fallback = authorFallback(image);
  const [failed, setFailed] = useState(false);
  const src = !failed && delivery ? delivery : fallback;
  if (!src) return null;
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => { if (delivery && fallback && !failed) setFailed(true); }} />;
}
