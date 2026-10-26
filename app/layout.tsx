import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://ourteacherschool.vercel.app"),
  title: { default: "Our Teacher School | Build Your Life", template: "%s | Our Teacher School" },
  description: "Our Teacher School ផ្តល់ការបំប៉នសិស្ស ថ្នាក់ភាសាបរទេស និងជំនាញកុំព្យូទ័រ។",
  keywords: ["Our Teacher School", "សាលាបំប៉ន", "រៀនកុំព្យូទ័រ", "រៀនភាសាអង់គ្លេស", "Cambodia school"],
  openGraph: { type: "website", locale: "km_KH", siteName: "Our Teacher School", title: "Our Teacher School | Build Your Life", description: "ការអប់រំប្រកបដោយគុណភាព សម្រាប់អនាគតសិស្ស។", images: [{ url: "/logo-hero.png", alt: "Our Teacher School" }] },
  twitter: { card: "summary_large_image", title: "Our Teacher School | Build Your Life", description: "ការអប់រំប្រកបដោយគុណភាព សម្រាប់អនាគតសិស្ស។", images: ["/logo-hero.png"] },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsId = process.env.NEXT_PUBLIC_GA_ID;
  return <html lang="km"><body>{children}{analyticsId && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)} gtag('js', new Date()); gtag('config', '${analyticsId}');`}</Script></>}</body></html>;
}
