"use client";

import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers";
import { locales } from "@/lib/locales";

export const FooterSection = () => {
  const { language } = useLanguage();
  const t = locales[language];

  return (
    <footer id="footer" className="container py-12 md:py-16">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between gap-x-12 gap-y-8">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex font-bold items-center">
              <Image src="/Ada Media News.png" alt="Ada Media Logo" width={64} height={64} className="w-16 h-16 mr-3 object-contain" />
              <h3 className="text-3xl">AdaMedia.lk</h3>
            </Link>
            <div className="opacity-60 font-medium ml-1">
              {t.footerLocation}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <h3 className="font-bold text-lg">{t.footerQuickLinks}</h3>
            <div>
              <Link href="#reels" className="opacity-60 hover:opacity-100">
                {t.navReels}
              </Link>
            </div>
            <div>
              <Link href="#trust" className="opacity-60 hover:opacity-100">
                {t.navTrust}
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; {new Date().getFullYear()}
            <Link
              href="#"
              className="text-[#ac0006] transition-all hover:underline ml-1"
            >
              Ada Media
            </Link>. {t.footerRights}
          </h3>
        </section>
      </div>
    </footer>
  );
};
