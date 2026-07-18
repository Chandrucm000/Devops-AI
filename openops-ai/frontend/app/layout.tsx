import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "OpenOps AI", description: "DevOps intelligence workspace" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
