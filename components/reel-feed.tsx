"use client";

import { useLanguage } from "@/app/providers";
import { locales } from "@/lib/locales";
import { useEffect, useState } from "react";

type Reel = {
  id: string;
  description: string;
  source: string;
  picture: string;
  permalink_url: string;
};

export const ReelFeed = () => {
  const { language } = useLanguage();
  const t = locales[language];
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch("/api/reels");
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setReels(data.data);
          } else {
            setError("No data received from API.");
          }
        } else {
          const errData = await response.json();
          setError(`API Error: ${errData.details?.error?.message || errData.error || response.statusText}`);
        }
      } catch (err) {
        console.error("Failed to fetch reels", err);
        setError("Error loading reels.");
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  return (
    <section id="reels" className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          {t.reelSectionTitle1} <span className="text-transparent bg-gradient-to-r from-[#ac0006] to-[#8f0909] bg-clip-text">{t.reelSectionTitleHighlight}</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t.reelSectionDesc}
        </p>
      </div>
      
      <div className="w-full relative z-10 mt-8">
        {/* Ambient Crimson Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] h-[200px] bg-gradient-to-r from-[#ac0006]/40 to-[#8f0909]/40 blur-[120px] rounded-full -z-10" />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ac0006]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">
            {error} <br />
            <span className="text-sm text-muted-foreground mt-2 block">Please check if the Facebook Page Access Token is valid.</span>
          </div>
        ) : reels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto">
            {reels.map((reel) => (
              <div 
                key={reel.id} 
                className="group relative rounded-2xl overflow-hidden border border-[#ac0006]/20 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-[#ac0006]/60 hover:shadow-[0_0_40px_-15px_rgba(172,0,6,0.5)] flex flex-col aspect-[9/16]"
              >
                <video 
                  src={reel.source} 
                  poster={reel.picture}
                  controls
                  preload="none"
                  className="w-full h-full object-cover"
                />
                
                {/* Description Overlay - appears when not playing (handled natively by the video element mostly, but we can add a title if needed) */}
                <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm line-clamp-2 font-medium">
                    {reel.description || "Facebook Reel"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            {t.loadingWidget || "No reels available at the moment."}
          </div>
        )}
      </div>
    </section>
  );
};
