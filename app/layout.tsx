import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { siteName, siteUrl } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Our Teacher School | សាលាបំប៉ននៅភ្នំពេញ", template: "%s | Our Teacher School" },
  description: "Our Teacher School នៅភ្នំពេញ ផ្តល់ថ្នាក់បំប៉នទី១–១២ មត្តេយ្យ ភាសាបរទេស និងជំនាញកុំព្យូទ័រ។",
  keywords: ["Our Teacher School", "សាលាបំប៉នភ្នំពេញ", "សាលាបំប៉ន", "រៀនកុំព្យូទ័រ", "រៀនភាសាអង់គ្លេស", "Phnom Penh school", "Cambodia school"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "ovRTXrZGV5P7AUf2-kI5tZZROqM4G5OknSyFXOza1Ng" },
  openGraph: { type: "website", locale: "km_KH", siteName, url: "/", title: "Our Teacher School | សាលាបំប៉ននៅភ្នំពេញ", description: "ការអប់រំប្រកបដោយគុណភាព សម្រាប់អនាគតសិស្ស។", images: [{ url: "/logo-hero.png", alt: "Our Teacher School" }] },
  twitter: { card: "summary_large_image", title: "Our Teacher School | Build Your Life", description: "ការអប់រំប្រកបដោយគុណភាព សម្រាប់អនាគតសិស្ស។", images: ["/logo-hero.png"] },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsId = process.env.NEXT_PUBLIC_GA_ID;
  const schoolSchema = {
    "@context": "https://schema.org",
    "@type": "School",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "សាលាបំប៉ន និងបណ្តុះជំនាញសម្រាប់សិស្សនៅភ្នំពេញ។",
    foundingDate: "2002",
    telephone: ["+85510744440", "+85577244440"],
    address: { "@type": "PostalAddress", addressLocality: "Phnom Penh", addressCountry: "KH" },
    sameAs: ["https://www.facebook.com/ourteacherschool", "https://www.youtube.com/@ourteacherschool1", "https://www.tiktok.com/@ourteacherschool"],
  };
  return <html lang="km"><body>{children}<Script id="school-structured-data" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schoolSchema)}</Script>{analyticsId && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)} gtag('js', new Date()); gtag('config', '${analyticsId}');`}</Script></>}</body></html>;
}
