"use client";

import { useLanguage } from "@/app/providers";
import { locales } from "@/lib/locales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, RefreshCcw } from "lucide-react";

export const TrustSection = () => {
  const { language } = useLanguage();
  const t = locales[language];

  return (
    <section id="trust" className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t.trustTitle}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t.trustDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-card shadow-sm border-secondary hover:shadow-md transition-shadow">
          <CardHeader>
            <ShieldCheck className="w-10 h-10 text-[#ac0006] mb-4" />
            <CardTitle className="text-xl">{t.trustPoint1Title}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            {t.trustPoint1Desc}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-secondary hover:shadow-md transition-shadow">
          <CardHeader>
            <CheckCircle2 className="w-10 h-10 text-[#ac0006] mb-4" />
            <CardTitle className="text-xl">{t.trustPoint2Title}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            {t.trustPoint2Desc}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-secondary hover:shadow-md transition-shadow">
          <CardHeader>
            <RefreshCcw className="w-10 h-10 text-[#ac0006] mb-4" />
            <CardTitle className="text-xl">{t.trustPoint3Title}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            {t.trustPoint3Desc}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
