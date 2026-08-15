"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const INITIAL_REELS_COUNT = 3;
const REELS_PER_LOAD = 3;

// Mock Facebook Reel URLs matching AdaMediaLK
const MOCK_REELS = [
  "https://www.facebook.com/AdaMediaLK/videos/123456789/",
  "https://www.facebook.com/AdaMediaLK/videos/987654321/",
  "https://www.facebook.com/AdaMediaLK/videos/112233445/",
  "https://www.facebook.com/AdaMediaLK/videos/556677889/",
  "https://www.facebook.com/AdaMediaLK/videos/998877665/",
  "https://www.facebook.com/AdaMediaLK/videos/445566778/",
  "https://www.facebook.com/AdaMediaLK/videos/332211009/",
  "https://www.facebook.com/AdaMediaLK/videos/667788990/",
  "https://www.facebook.com/AdaMediaLK/videos/102938475/",
];

interface ReelEmbedProps {
  reelUrl: string;
}

const ReelEmbed: React.FC<ReelEmbedProps> = ({ reelUrl }) => {
  useEffect(() => {
    // Check if Facebook SDK is initialized, then trigger parser for this component asynchronously
    if (typeof window !== "undefined" && (window as any).FB) {
      try {
        (window as any).FB.XFBML.parse();
      } catch (err) {
        console.error("FB parse error:", err);
      }
    }
  }, [reelUrl]);

  return (
    <div className="flex justify-center items-center w-full my-4 transition-all hover:-translate-y-1">
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
          border: "1px solid rgba(172,0,6,0.3)",
          boxShadow: "0 10px 30px -10px #8f0909"
        }}
      />
    </div>
  );
};

export const ReelFeed = () => {
  const [visibleReels, setVisibleReels] = useState<number>(INITIAL_REELS_COUNT);

  const handleLoadMore = () => {
    setVisibleReels((prev) => Math.min(prev + REELS_PER_LOAD, MOCK_REELS.length));
  };

  const hasMore = visibleReels < MOCK_REELS.length;

  return (
    <section id="reels" className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Latest <span className="text-transparent bg-gradient-to-r from-[#ac0006] to-[#8f0909] bg-clip-text">News</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Watch our highly produced daily video reports directly on our feed.
        </p>
      </div>
      
      {/* Responsive Grid: 1 col on mobile, 2 col on tablet, 3 col masonry-style on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {MOCK_REELS.slice(0, visibleReels).map((url, index) => (
          <ReelEmbed key={`${url}-${index}`} reelUrl={url} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-14">
          <Button 
            onClick={handleLoadMore} 
            size="lg"
            className="bg-[#ac0006] hover:bg-[#8f0909] text-white font-semibold rounded-full px-10 py-6 text-lg shadow-[0_4px_20px_0_rgba(172,0,6,0.4)] transition-all hover:shadow-[0_6px_25px_rgba(172,0,6,0.6)] hover:-translate-y-1"
          >
            Load More News
          </Button>
        </div>
      )}
    </section>
  );
};
