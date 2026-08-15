"use client";

export const ReelFeed = () => {
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
      
      {/* SociableKIT Facebook Reels Embed - iFrame Method */}
      {/* 
        Using an iframe completely bypasses React's strict script execution lifecycle,
        making it 100% reliable regardless of what framework you use.
      */}
      <div className="w-full flex justify-center mt-8 relative z-10">
        {/* Ambient Crimson Glow Behind Top of Widget */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] h-[200px] bg-gradient-to-r from-[#ac0006]/40 to-[#8f0909]/40 blur-[120px] rounded-full -z-10" />
        
        <div className="w-full max-w-screen-xl relative rounded-2xl overflow-hidden border border-[#ac0006]/30 shadow-[0_0_50px_-15px_rgba(172,0,6,0.4)] bg-card transition-all duration-300 hover:border-[#ac0006]/60 hover:shadow-[0_0_70px_-15px_rgba(172,0,6,0.6)]">
          <iframe 
            src="https://widgets.sociablekit.com/facebook-reels/iframe/25705671" 
            frameBorder="0" 
            width="100%" 
            height="1000" 
            className="border-none bg-transparent w-full block"
            title="Ada Media Facebook Feed"
          />
        </div>
      </div>
    </section>
  );
};
