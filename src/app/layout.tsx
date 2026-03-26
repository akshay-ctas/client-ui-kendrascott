import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { AddressProvider } from "@/context/AddressContext";
import { WishListProvider } from "@/context/WishListContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const SITE_URL =
  process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

const SITE_NAME = "Kendra Scott Clone";
const DEFAULT_DESCRIPTION =
  "Shop elegant jewelry including necklaces, earrings, rings and modern accessories.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description: DEFAULT_DESCRIPTION,

  keywords: [
    "jewelry",
    "necklaces",
    "earrings",
    "rings",
    "fashion jewelry",
    "online jewelry store",
    "kendra scott clone",
  ],

  authors: [{ name: "Aksahy thummar" }],
  creator: "Akshay",
  publisher: SITE_NAME,

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${inter.variable} antialiased bg-background min-h-screen text-foreground flex flex-col`}
      >
        <Providers>
          <WishListProvider>
            <CartProvider>
              <AuthProvider>
                <AddressProvider>
                  <TopBar />
                  <Header />

                  <main className="flex-1">{children}</main>

                  <Footer />
                  <Toaster richColors={false} />
                </AddressProvider>
              </AuthProvider>
            </CartProvider>
          </WishListProvider>
        </Providers>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
