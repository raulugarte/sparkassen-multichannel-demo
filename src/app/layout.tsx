import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Sparkassen Multi-Channel Demo", description: "Unabhängige Demo für AEM Content Fragments und drei digitale Kanäle" };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="de"><body>{children}</body></html>; }
