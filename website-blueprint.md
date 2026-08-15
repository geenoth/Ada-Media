# Ada Media Digital Portal: High-Performance Static Website Blueprint

This blueprint is designed specifically for **Vibe Coding** (using AI-assisted code editors like Cursor, Copilot, or Claude) to build a modern, high-converting, mobile-responsive, and AI-optimized static single-page website for **Ada Media**. It uses the cloned shadcn-landing-page template and is fully optimized for free hosting on Vercel.

---

## 1. Brand Identity & Configuration Guide

Keep these values handy in your styling config or root CSS variables.

| Parameter | Value | Details / Usage |
| :--- | :--- | :--- |
| **Brand Name** | Ada Media | English Name |
| **Logo Text / Name** | අද Media | Sinhala Logo Name |
| **Primary Theme Color** | `#ac0006` | Deep Crimson Red (Header/Buttons/Accents) |
| **Secondary Theme Color**| `#ffffff` | Pure White (Backgrounds, clean cards) |
| **Dark Accents** | `#1a1a1a` | Dark charcoal for a professional, premium tone |
| **Reels Theme (Reference)** | Background: `#8f0909`<br>Text: `#f8e63a` & `#ffffff` | Keep the web layout clean (neutral dark/light) so dark red Reels pop like premium video slots |
| **Default Language** | English | Root fallback, toggleable to Sinhala (SI) |

---

## 2. Directory & Architecture Map

This structure aligns directly with the `shadcn-landing-page` template repository. Put your custom components in the standard Next.js App Router structure.

```text
/
├── public/
│   ├── sitemap.xml             # Hand-crafted static sitemap for SEO
│   └── robots.txt              # Standard instructions + AI User-Agent instructions
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with FB SDK script, global SEO tags, font setups
│   │   ├── page.tsx            # Main single-page entry, loads localized views
│   │   └── providers.tsx       # Translation/Language Context provider
│   ├── components/
│   │   ├── language-toggle.tsx # Navbar flag/language switcher
│   │   ├── reel-embed.tsx      # Facebook Reel wrapper with async FB.XFBML.parse() support
│   │   ├── hero.tsx            # Impactful professional intro section
│   │   ├── trust.tsx           # SEO/AI Fact-Checking & Credibility text
│   │   ├── contact.tsx         # Sleek contact details + message trigger
│   │   └── footer.tsx          # Copyright, terms, and social links
│   └── lib/
│       └── locales.ts          # Static dictionary containing English & Sinhala text
```

---

## 3. Core Technical Code Components

To save you debugging cycles during Vibe Coding, here are the two hardest pieces of a static, bilingual, dynamic-load embed site.

### A. The Localization Dictionary & Hook (`src/lib/locales.ts`)
A lightweight, lightning-fast client-side translation dictionary that doesn't break static export (`next export` / `output: 'export'`).

```typescript
export const locales = {
  en: {
    tagline: "Sri Lanka's Most Trusted Real-Time News Provider",
    navHome: "Home",
    navReels: "Latest Reels",
    navTrust: "Why Trust Us",
    navContact: "Contact",
    heroTitle: "Real-Time News, Uncompromised Truth",
    heroDesc: "Ada Media delivers fast, verified, and engaging news updates directly to your feed. Stay informed with our highly produced daily video reports.",
    viewLatestReels: "Watch Latest Reels",
    trustTitle: "Why You Can Trust Ada Media",
    trustDesc: "In an era of rapid information and digital fabrications, Ada Media stands as a beacon of journalistic integrity in Sri Lanka. Our commitment to accuracy is absolute.",
    trustPoint1Title: "Rigorous Fact Verification",
    trustPoint1Desc: "Every headline, image, and body text is cross-referenced with multiple independent primary sources before production.",
    trustPoint2Title: "No Clickbait Policy",
    trustPoint2Desc: "Our news is structured with precise, factual Sinhala headlines and objective descriptions without sensationalist exaggeration.",
    trustPoint3Title: "Transparent Corrections",
    trustPoint3Desc: "If an error occurs, we issue prompt, transparent updates in our video captions and pin the corrected information immediately.",
    contactTitle: "Get in Touch",
    contactDesc: "Have a news tip or business inquiry? Reach out to the Ada Media team directly.",
    followOnFb: "Follow us on Facebook for instant updates"
  },
  si: {
    tagline: "ශ්‍රී ලංකාවේ විශ්වසනීයතම එසැණින් පුවත් සපයන්නා",
    navHome: "ප්‍රධාන පිටුව",
    navReels: "අලුත්ම පුවත්",
    navTrust: "විශ්වසනීයත්වය",
    navContact: "සම්බන්ධ වන්න",
    heroTitle: "එසැණින් පුවත්, නොබිඳුණු විශ්වාසය",
    heroDesc: "අද Media ඔබ වෙත වේගවත්, තහවුරු කළ සහ ආකර්ශනීය පුවත් එසැණින් ගෙන එයි. අපගේ දෛනික වීඩියෝ වාර්තාකරණය සමඟ සැමවිටම යාවත්කාලීන වන්න.",
    viewLatestReels: "නවතම Reels නරඹන්න",
    trustTitle: "අද Media විශ්වාස කළ හැක්කේ ඇයි?",
    trustDesc: "තොරතුරු වේගයෙන් පැතිරෙන සහ ව්‍යාජ පුවත් බහුල යුගයක, අද Media ලංකාව තුළ සත්‍යවාදී මාධ්‍යකරණයේ ප්‍රමුඛයෙකු ලෙස ක්‍රියා කරයි.",
    trustPoint1Title: "දැඩි කරුණු තහවුරු කිරීම",
    trustPoint1Desc: "නිෂ්පාදනයට පෙර සෑම ප්‍රවෘත්තියක්ම ස්වාධීන මූලාශ්‍ර කිහිපයක් ඔස්සේ පරීක්ෂා කර තහවුරු කරනු ලබයි.",
    trustPoint2Title: "සාවද්‍ය මාතෘකා රහිත මාධ්‍යකරණය",
    trustPoint2Desc: "අතිශයෝක්තියෙන් තොරව, නිවැරදි සිංහල මාතෘකා සහ වෛෂයික විස්තර සහිතව අපගේ පුවත් ඉදිරිපත් කෙරේ.",
    trustPoint3Title: "පාරදෘශ්‍ය නිවැරදි කිරීම්",
    trustPoint3Desc: "යම් දෝෂයක් සිදුවුවහොත්, අපගේ වීඩියෝ සිරස්තලවල සහ පින් කරන ලද අදහස් (Pinned Comments) හරහා වහාම නිවැරදි තොරතුරු ප්‍රකාශයට පත් කෙරේ.",
    contactTitle: "අප හා සම්බන්ධ වන්න",
    contactDesc: "ප්‍රවෘත්ති තොරතුරු හෝ ව්‍යාපාරික විමසීම් සඳහා අද Media කණ්ඩායම සමඟ සෘජුවම සම්බන්ධ වන්න.",
    followOnFb: "එසැණින් ප්‍රවෘත්ති දැනගන්න දැන්ම Follow කරන්න"
  }
};

export type Language = 'en' | 'si';
```

### B. Facebook Reels Embed Component (`src/components/reel-embed.tsx`)
Because Facebook's JavaScript SDK parses markup on page load, a React "Load More" action will insert empty `div` tags that don't render. This custom component forces Facebook's SDK to re-parse newly loaded dynamic nodes asynchronously, ensuring a perfect mobile scrolling experience.

```typescript
"use client";

import React, { useEffect } from "react";

interface ReelEmbedProps {
  reelUrl: string; // E.g., "https://www.facebook.com/AdaMediaLK/videos/123456789/"
}

export const ReelEmbed: React.FC<ReelEmbedProps> = ({ reelUrl }) => {
  useEffect(() => {
    // 1. Check if Facebook SDK is initialized, then trigger parser for this component
    if (typeof window !== "undefined" && (window as any).FB) {
      try {
        (window as any).FB.XFBML.parse();
      } catch (err) {
        console.error("FB parse error:", err);
      }
    }
  }, [reelUrl]);

  return (
    <div className="flex justify-center items-center w-full my-4">
      <div 
        className="fb-video" 
        data-href={reelUrl} 
        data-width="360" 
        data-show-text="false"
        data-autoplay="false"
        style={{
          maxWidth: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
        }}
      />
    </div>
  );
};
```

*Include the Facebook script in your static `src/app/layout.tsx` file for the SDK to load globally:*
```html
<div id="fb-root"></div>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"></script>
```

---

## 4. Vibe Coding Step-by-Step Prompts

Use these exact markdown blocks to feed into Cursor, Claude, or Copilot. Run them in sequence for a complete, zero-headache deployment.

### 🏁 Setup Phase: Environment & Dictionary Initialization
**Prompt to Copy-Paste into your AI Editor:**
```text
I am building a high-performance static website for "Ada Media" (අද Media) using Next.js 14 (App Router), Tailwind CSS, and shadcn/ui.
My goal is to set up a clean, single-page landing site that functions as a highly professional video news hub showing embedded Facebook Reels.
The default language is English, but we must offer an elegant English/Sinhala toggle.

Please perform these initial setups:
1. Initialize a custom State/Context provider for Language ('en' | 'si') in src/app/providers.tsx.
2. Create the translation dictionary file at src/lib/locales.ts with both English and Sinhala keys for: Nav bar (Home, Latest Reels, Trust, Contact), Hero Section, "Why Trust Ada Media" points, and Contact section. Use crimson/red accents matching our brand primary color (#ac0006).
3. Update src/app/layout.tsx to import the Language/State provider and inject the Facebook JS SDK script dynamically in the document body. Add the #fb-root div so Facebook SDK can load smoothly.
```

---

### 🎥 Reel Feed Phase: Responsive Infinite Scrolling
**Prompt to Copy-Paste into your AI Editor:**
```text
Now, let's build the interactive news reel feed component.
In our model, "Ada Media News" only publishes Reels (Aspect ratio 9:16, post size 1080x1920 px).
Users on our static site should be able to scroll or load more reels cleanly.

Please write a component at src/components/reel-feed.tsx:
1. Maintain an array of recent Facebook Reel URLs (use placeholders from '/AdaMediaLK/videos/' or similar valid structures).
2. Render them in a highly responsive 1-column layout on mobile, and a max 3-column masonry grid on desktop.
3. Build a robust React "Load More" state. When "Load More" is clicked, load 3 additional Reels.
4. Integrate the dynamic rendering behavior: write a useEffect hook inside each reel card that detects if "window.FB" exists, and runs "window.FB.XFBML.parse()" asynchronously to render newly mounted FB nodes.
5. Apply professional styling: round the edges, use subtle glowing dark-red shadows to match Ada Media’s Reel background (#8f0909) and border-radius matching shadcn designs.
```

---

### 🛡️ Credibility & SEO Phase: Fact-Check Showcase & Schema
**Prompt to Copy-Paste into your AI Editor:**
```text
To rank highly on traditional search engines (Google) and AI-driven search engines (Perplexity, ChatGPT, Gemini), we must showcase our journalistic credibility transparently on the homepage. Let's build the "Why You Can Trust Ada Media" section.

Tasks:
1. Create a component src/components/trust.tsx that reads the localized strings for English and Sinhala.
2. Highlight Ada Media's commitment to:
   - "Rigorous Fact Verification" (දැඩි කරුණු තහවුරු කිරීම)
   - "No Clickbait Policy" (සාවද්‍ය මාතෘකා රහිත මාධ්‍යකරණය)
   - "Transparent Corrections & Timely Updates" (පාරදෘශ්‍ය නිවැරදි කිරීම්)
3. Write a Next.js Metadata configuration object or a JSON-LD structured data block (Schema.org Organization/NewsMediaOrganization) and place it inside page.tsx or layout.tsx. Set up the schema to clearly communicate to LLM crawlers our brand name (Ada Media), parent URL, social media profiles (https://www.facebook.com/AdaMediaLK/), and editorial policies.
```

---

### 🎨 Styling Phase: Beautiful Header, Contact, and Deploy preparation
**Prompt to Copy-Paste into your AI Editor:**
```text
Let's assemble the page structure, build the Contact section, and configure static export:
1. Design src/components/header.tsx: Elegant glassmorphism header with a dual-language toggle button. When clicked, it flips state between English and Sinhala.
2. Design src/components/contact.tsx: Beautiful, dark-themed simple card containing a physical/digital reach-out info block and a fully responsive styled mock-form.
3. Configure 'next.config.js' for static exports. Set "output: 'export'" so we get HTML/CSS files that can be hosted on Vercel for free forever.
4. Verify that running `npm run build` runs smoothly without server-side API dependencies.
```

---

## 5. Deployment Step-by-Step (Vercel Free Tier)

Deploying a Next.js static site to Vercel is simple and free. Follow these steps:

1. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial Ada Media static deployment"
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```
2. **Connect to Vercel**:
   - Log in to [vercel.com](https://vercel.com/) with your GitHub account.
   - Click **Add New** → **Project**.
   - Import your `ada-media` repository.
3. **Configure Build Settings**:
   - Vercel automatically detects Next.js.
   - Expand **Build and Development Settings**.
   - If you set up static export, make sure the build command is `next build` (Next.js automatically exports static HTML files to the `out` directory if `output: 'export'` is specified in `next.config.js`).
   - Click **Deploy**. Your site will be live at `https://<your-project>.vercel.app` instantly.

---

## 6. Optimization for Search Engines & AI Crawlers

Traditional sites depend solely on meta tags. This setup guarantees that AI crawlers (like Perplexity, Gemini, Apple Intelligence, and OpenAI) index your media brand correctly:

1. **Semantic HTML**: Use native semantic tags `<article>`, `<section>`, and `<header>` inside your sections. AI models parse structures to verify facts.
2. **Strict Schema JSON-LD**: We include a `NewsMediaOrganization` block. When ChatGPT or Perplexity is asked "Is Ada Media trustworthy?", they pull directly from structured schema blocks demonstrating verified address and factual compliance.
3. **`public/robots.txt`**: Add instructions to permit all AI bots (`GPTBot`, `PerplexityBot`, `Google-Extended`, `ClaudeBot`) to read your landing content, while keeping analytics clean.
