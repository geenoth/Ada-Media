"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/app/providers";
import { locales } from "@/lib/locales";

export const HeroSection = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = locales[language];
  return (
    <section className="container w-full relative">
      {/* Background Gradient Glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] h-[400px] bg-[#ac0006]/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
      
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto pt-16 pb-4 md:pt-24 md:pb-8 relative z-10">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-[#ac0006]">
              <Badge className="bg-[#ac0006] hover:bg-[#8f0909]">Ada Media</Badge>
            </span>
            <span> {t.tagline} </span>
          </Badge>

          <div className="max-w-screen-lg mx-auto text-center text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <h1>
              {t.heroTitle1}{" "}
              <span className="text-transparent px-2 bg-gradient-to-r from-[#ac0006] to-[#ff4d4d] bg-clip-text">
                {t.heroTitleHighlight}
              </span>{" "}
              {t.heroTitle2}
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            {t.heroDesc}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button asChild className="w-5/6 md:w-1/3 font-bold group/arrow bg-[#ac0006] hover:bg-[#8f0909] text-white">
              <Link href="#reels">
                {t.viewLatestReels}
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>


      </div>
    </section>
  );
};
