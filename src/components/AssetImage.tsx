"use client";

import { useState } from "react";
import type { ImageRef } from "@/lib/content";

const DELIVERY_ORIGIN = "https://delivery-p130407-e1279066.adobeaemcloud.com";
const ASSET_PREFIX = "/content/dam/dsv/images/";

/** Convert AEM GraphQL Dynamic Media identifiers to the tested Assets Delivery URL format. */
export function deliveryUrl(image?: ImageRef, width = 1200): string | null {
  const raw = image?._dynamicUrl;
  if (!raw) return null;
  try {
    const url = new URL(raw, DELIVERY_ORIGIN);
    const match = url.pathname.match(/^\/adobe\/dynamicmedia\/deliver\/dm-aid--([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})\/(.+)$/i);
    if (!match) return null;
    const id = match[1].toLowerCase();
    // The trailing name is an output alias. Preserve the source name rather than inventing a product mapping.
    const filename = match[2].split("/").pop();
    if (!filename || !/^[\w.%-]+$/.test(filename)) return null;
    const safeWidth = Math.max(100, Math.min(2400, Math.round(width)));
    return `${DELIVERY_ORIGIN}/adobe/assets/urn:aaid:aem:${id}/as/${filename}?width=${safeWidth}`;
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
