"use client";
import { ChevronsDown, Globe, Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";
import { useLanguage } from "@/app/providers";
import { locales } from "@/lib/locales";

interface RouteProps {
  href: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#team",
    label: "Team",
  },
  {
    href: "#contact",
    label: "Contact",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

const featureList: FeatureProps[] = [
  {
    title: "Showcase Your Value ",
    description: "Highlight how your product solves user problems.",
  },
  {
    title: "Build Trust",
    description:
      "Leverages social proof elements to establish trust and credibility.",
  },
  {
    title: "Capture Leads",
    description:
      "Make your lead capture form visually appealing and strategically.",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();
  const t = locales[language];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "si" : "en");
  };

  const dynamicRouteList = [
    { href: "#reels", label: t.navReels },
    { href: "#trust", label: t.navTrust },
    { href: "#contact", label: t.navContact },
  ];

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <ChevronsDown className="bg-gradient-to-tr border-secondary from-[#ac0006] via-[#ac0006]/70 to-[#ac0006] rounded-lg w-9 h-9 mr-2 border text-white" />
        අද Media
      </Link>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <ChevronsDown className="bg-gradient-to-tr border-secondary from-[#ac0006] via-[#ac0006]/70 to-[#ac0006] rounded-lg w-9 h-9 mr-2 border text-white" />
                    අද Media
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {dynamicRouteList.map(({ href, label }) => (
                  <Button
                    key={label}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start gap-4">
              <Separator className="mb-2" />
              <div className="flex gap-4">
                <ToggleTheme />
                <Button variant="outline" onClick={toggleLanguage} className="font-bold">
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'සිංහල' : 'English'}
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            {dynamicRouteList.map(({ href, label }) => (
              <NavigationMenuLink key={label} asChild>
                <Link href={href} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex gap-2">
        <ToggleTheme />
        <Button variant="ghost" onClick={toggleLanguage} className="font-bold">
          <Globe className="w-5 h-5 mr-2" />
          {language === 'en' ? 'සිංහල' : 'English'}
        </Button>
      </div>
    </header>
  );
};
