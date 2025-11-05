import type { Metadata } from "next";
import { Geist, Geist_Mono, Zalando_Sans_Expanded, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zalandoSansExpanded = Zalando_Sans_Expanded({
  variable: "--font-zalando-sans-expanded",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hash Pix",
  description: "light-weight pixel avatar generator",
  openGraph: { // for social media, search engines, etc. This creates a preview card for the website.
    title: "Hash Pix",
    description: "light-weight pixel avatar generator",
    url: "https://hashpix.vinitkeshri.com",
    siteName: "Hash Pix",
    images: [
      {
        url: "https://hashpix.vinitkeshri.com/logo.png",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zalandoSansExpanded.variable} ${pressStart2P.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
