import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Teacher School",
  description: "Our Teacher School — Build Your Life. ESTD 2002.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="km"><body>{children}</body></html>;
}
