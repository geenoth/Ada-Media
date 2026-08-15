import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-12 md:py-16">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex font-bold items-center">
              <ChevronsDownIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-[#ac0006] via-[#ac0006]/70 to-[#ac0006] rounded-lg border border-secondary text-white" />
              <h3 className="text-2xl">අද Media</h3>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Quick Links</h3>

            <div>
              <Link href="#reels" className="opacity-60 hover:opacity-100">
                Latest News
              </Link>
            </div>
            <div>
              <Link href="#trust" className="opacity-60 hover:opacity-100">
                Why Trust Us
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Social Media</h3>
            <div>
              <Link href="https://www.facebook.com/AdaMediaLK/" target="_blank" className="opacity-60 hover:opacity-100">
                Facebook
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                YouTube
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                TikTok
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 xl:col-span-2">
            <h3 className="font-bold text-lg">Contact</h3>
            <div>
              <Link href="mailto:contact@adamedia.lk" className="opacity-60 hover:opacity-100">
                contact@adamedia.lk
              </Link>
            </div>
            <div className="mt-4 opacity-60">
              Colombo, Sri Lanka
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
            </Link>. All rights reserved.
          </h3>
        </section>
      </div>
    </footer>
  );
};
