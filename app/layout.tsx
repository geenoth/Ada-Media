import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "./providers";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadcn - Landing template",
  description: "Landing template from Shadcn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              "name": "Ada Media",
              "url": "https://adamedia.lk",
              "logo": "https://adamedia.lk/logo.png",
              "sameAs": [
                "https://www.facebook.com/AdaMediaLK/"
              ],
              "publishingPrinciples": "https://adamedia.lk/#trust",
              "description": "Sri Lanka's Most Trusted Real-Time News Provider with rigorous fact verification and zero clickbait policy."
            })
          }}
        />
      </head>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Navbar />
            {children}
          </LanguageProvider>
        </ThemeProvider>
        
        <div id="fb-root"></div>
        <Script 
          async 
          defer 
          crossOrigin="anonymous" 
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
