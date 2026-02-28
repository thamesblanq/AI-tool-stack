import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: 'AI Tool Discovery | Find the Perfect AI Tools',
  description: 'A curated directory of the best AI tools for coding, design, video editing, and productivity. Discover and bookmark your favorites.',
  openGraph: {
    title: 'AI Tool Discovery',
    description: 'Find the perfect AI tools to optimize your workflow.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tool Discovery',
    description: 'Discover the best AI tools to optimize your workflow.',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
