import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
const AUTHOR = "https://author-p130407-e1279066.adobeaemcloud.com";
const PREFIX = "/content/dam/dsv/images/";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const token = process.env.AEM_AUTH_TOKEN;
  if (!path || !path.startsWith(PREFIX) || path.includes("..") || path.includes("\\") || !/\.(jpe?g|png|webp|gif)$/i.test(path)) {
    return new NextResponse("Invalid asset path", { status: 400 });
  }
  if (!token) return new NextResponse("AEM authentication unavailable", { status: 503 });
  try {
    const upstream = await fetch(AUTHOR + path, {
      headers: { Authorization: `Bearer ${token}`, Accept: "image/*" },
      next: { revalidate: 60 },
    });
    if (!upstream.ok) return new NextResponse("Asset unavailable", { status: 502 });
    const contentType = upstream.headers.get("content-type") || "";
    if (!/^image\/(jpeg|png|webp|gif)(;|$)/i.test(contentType)) return new NextResponse("Unexpected asset type", { status: 502 });
    const size = Number(upstream.headers.get("content-length") || 0);
    if (size > 12_000_000) return new NextResponse("Asset too large", { status: 413 });
    const bytes = await upstream.arrayBuffer();
    if (bytes.byteLength > 12_000_000) return new NextResponse("Asset too large", { status: 413 });
    return new NextResponse(bytes, { headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=60, s-maxage=60", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("AEM asset request failed", error);
    return new NextResponse("Asset fetch failed", { status: 502 });
  }
}
