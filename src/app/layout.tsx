import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Anyone with a spare machine can offer it. Anyone else pays that host for the hours they use.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cynera.cloud"),
  title: "Cynera",
  description,
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
  openGraph: {
    title: "Idle servers used to sit around. That's over.",
    description,
    url: "https://cynera.cloud",
    siteName: "Cynera",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1280,
        height: 511,
        alt: "Cynera. Spare machines, paid by the hour.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Idle servers used to sit around. That's over.",
    description,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-black font-sans text-white">{children}</body>
    </html>
  );
}
