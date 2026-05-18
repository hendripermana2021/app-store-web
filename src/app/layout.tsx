import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebGratis Store",
  description: "Direktori website gratis berdasarkan kategori untuk belajar, kerja, dan produktivitas.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "WebGratis Store",
    description: "Kumpulan website gratis paling berguna berdasarkan kategori.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "WebGratis Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebGratis Store",
    description: "Temukan website gratis terbaik dalam satu web app.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
