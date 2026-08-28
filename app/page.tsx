import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { ReelFeed } from "@/components/reel-feed";
import { TrustSection } from "@/components/trust";

export const metadata = {
  title: "Ada Media | Real-Time News",
  description: "Sri Lanka's Most Trusted Real-Time News Provider",
  openGraph: {
    type: "website",
    url: "https://adamedia.lk",
    title: "Ada Media | Real-Time News",
    description: "Sri Lanka's Most Trusted Real-Time News Provider",
    images: [
      {
        url: "https://adamedia.lk/Ada%20Media%20News.png",
        width: 1200,
        height: 630,
        alt: "Ada Media - Real-Time News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://adamedia.lk",
    title: "Ada Media | Real-Time News",
    description: "Sri Lanka's Most Trusted Real-Time News Provider",
    images: [
      "https://adamedia.lk/Ada%20Media%20News.png",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ReelFeed />
      <TrustSection />
      <FAQSection />
      <ContactSection />
      <FooterSection />
    </>
  );
}
