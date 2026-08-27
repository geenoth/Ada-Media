"use client";

import { useLanguage } from "@/app/providers";
import { locales } from "@/lib/locales";
import { useEffect, useState, useRef } from "react";

type Reel = {
  id: string;
  description: string;
  source: string;
  picture: string;
  permalink_url: string;
  thumbnails?: {
    data: {
      height: number;
      width: number;
      uri: string;
    }[];
  };
};

const truncateText = (text: string, maxWords: number = 8) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "... see more";
  }
  return text;
};

// Facebook's signed URLs cannot be manually modified or they throw a 403 error.
// Instead, we use the 'thumbnails' array requested from the API to get the highest resolution available.
const getHighResPicture = (reel: Reel) => {
  if (reel.thumbnails && reel.thumbnails.data && reel.thumbnails.data.length > 0) {
    // Sort by height to get the highest quality thumbnail
    const sorted = [...reel.thumbnails.data].sort((a, b) => b.height - a.height);
    return sorted[0].uri;
  }
  return reel.picture;
};

export const ReelFeed = () => {
  const { language } = useLanguage();
  const t = locales[language];
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageCursor, setNextPageCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  // Custom Player States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch("/api/reels");
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setReels(data.data);
            if (data.paging?.cursors?.after && data.paging?.next) {
              setNextPageCursor(data.paging.cursors.after);
            } else {
              setNextPageCursor(null);
            }
            
            // Check for deep link
            const match = window.location.pathname.match(/\/news\/(\d+)/);
            if (match && match[1]) {
              const reelId = match[1];
              const targetReel = data.data.find((r: Reel) => r.id === reelId);
              if (targetReel) {
                setSelectedReel(targetReel);
              } else {
                // Fetch specific reel if not in the first page
                try {
                  const singleRes = await fetch(`/api/reels?id=${reelId}`);
                  if (singleRes.ok) {
                    const singleData = await singleRes.json();
                    if (singleData.data && singleData.data[0]) {
                      setReels(prev => {
                        // Avoid duplicates if it somehow exists
                        if (!prev.find(r => r.id === singleData.data[0].id)) {
                          return [singleData.data[0], ...prev];
                        }
                        return prev;
                      });
                      setSelectedReel(singleData.data[0]);
                    }
                  }
                } catch (e) {
                  console.error("Failed to fetch deep linked reel");
                }
              }
            }
            
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

  const loadMore = async () => {
    if (!nextPageCursor) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/reels?after=${nextPageCursor}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setReels(prev => [...prev, ...data.data]);
          if (data.paging?.cursors?.after && data.paging?.next) {
            setNextPageCursor(data.paging.cursors.after);
          } else {
            setNextPageCursor(null);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load more reels", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Prevent main page scrolling when modal is open and handle shallow routing
  useEffect(() => {
    if (selectedReel) {
      document.body.style.overflow = "hidden";
      setIsPlaying(true); // reset play state for new reel
      setProgress(0); // reset progress
      setIsCaptionExpanded(false); // reset caption expansion
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      
      // Shallow route update for SEO and Sharing
      if (window.location.pathname !== `/news/${selectedReel.id}`) {
        window.history.pushState(null, '', `/news/${selectedReel.id}`);
      }
    } else {
      document.body.style.overflow = "auto";
      
      // Revert URL when closing modal
      if (window.location.pathname.startsWith('/news/')) {
        window.history.pushState(null, '', '/');
      }
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedReel]);

  // Handle Play/Pause & Mute
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  // Scroll/Swipe Navigation
  const selectedIndex = reels.findIndex(r => r.id === selectedReel?.id);

  const goToNext = () => {
    if (selectedIndex >= 0 && selectedIndex < reels.length - 1) {
      setSelectedReel(reels[selectedIndex + 1]);
    }
  };

  const goToPrev = () => {
    if (selectedIndex > 0) {
      setSelectedReel(reels[selectedIndex - 1]);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) return;
    if (e.deltaY > 30) {
      goToNext();
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 600);
    } else if (e.deltaY < -30) {
      goToPrev();
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 600);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }
  };

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
                onClick={() => setSelectedReel(reel)}
                className="group cursor-pointer relative rounded-2xl overflow-hidden border border-[#ac0006]/20 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-[#ac0006]/60 hover:shadow-[0_0_40px_-15px_rgba(172,0,6,0.5)] flex flex-col aspect-[9/16]"
              >
                <img
                  src={getHighResPicture(reel)}
                  alt={reel.description || "Reel Thumbnail"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 drop-shadow-md" style={{ marginLeft: '2px' }}>
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
                  <p className="text-white text-sm sm:text-base font-medium drop-shadow-lg">
                    {truncateText(reel.description || "Facebook Reel", 8)}
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

        {nextPageCursor && reels.length > 0 && !loading && !error && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-3 rounded-full bg-[#ac0006] hover:bg-[#8f0909] text-white font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                "See More News"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Video Player Modal with TikTok-like scrolling */}
      {selectedReel && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-xl transition-all"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close/Back button */}
          <button
            onClick={() => setSelectedReel(null)}
            className="absolute top-4 left-4 sm:right-6 sm:top-6 sm:left-auto z-[110] w-12 h-12 bg-black/70 hover:bg-[#ac0006] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 border border-white/30 backdrop-blur-md group"
          >
            {/* Desktop Close Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 hidden sm:block group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {/* Mobile Back Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 sm:hidden pr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          {/* Navigation Hints for Desktop - Positioned to the right of the reel */}
          <div className="hidden sm:flex absolute left-[calc(50%+220px)] xl:left-[calc(50%+240px)] top-1/2 -translate-y-1/2 flex-col gap-4 z-[110]">
            <button
              onClick={goToPrev}
              disabled={selectedIndex === 0}
              className="w-14 h-14 bg-black/50 hover:bg-[#ac0006] disabled:opacity-30 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-xl group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:-translate-y-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              disabled={selectedIndex === reels.length - 1}
              className="w-14 h-14 bg-black/50 hover:bg-[#ac0006] disabled:opacity-30 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-xl group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:translate-y-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          <div
            className="relative w-full h-full sm:h-auto sm:max-w-[400px] sm:aspect-[9/16] bg-black/20 sm:rounded-2xl overflow-hidden shadow-[0_0_50px_-10px_rgba(172,0,6,0.4)] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-pointer group"
            onClick={togglePlay}
          >
            <video
              key={selectedReel.id} // Forces video element to remount and autoplay new source
              ref={videoRef}
              src={selectedReel.source}
              poster={getHighResPicture(selectedReel)}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
            />

            {/* Progress Bar (YouTube Shorts style at bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-[120]">
              <div
                className="h-full bg-[#ac0006] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Right Side Actions (YouTube Shorts style) */}
            <div className="absolute bottom-24 right-4 flex flex-col gap-5 items-center z-[120]">
              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/20 shadow-lg group relative"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
                <span className="absolute right-14 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm pointer-events-none">
                  {isMuted ? "Unmute" : "Mute"}
                </span>
              </button>
            </div>

            {/* Custom Center Play Button (Visible when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-2xl animate-in zoom-in duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10" style={{ marginLeft: '4px' }}>
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}

            {/* Caption Down in Reel */}
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 pt-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-[115]">
              <div className="pointer-events-auto">
                <p className="text-white text-base sm:text-lg font-medium drop-shadow-lg whitespace-pre-wrap max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                  {isCaptionExpanded
                    ? (selectedReel.description || "Facebook Reel")
                    : (selectedReel.description || "Facebook Reel").split('\n')[0]
                  }
                  {!isCaptionExpanded && (selectedReel.description || "").includes('\n') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCaptionExpanded(true);
                      }}
                      className="ml-2 font-bold opacity-80 hover:opacity-100 transition-opacity text-sm"
                    >
                      See more
                    </button>
                  )}
                  {isCaptionExpanded && (selectedReel.description || "").includes('\n') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCaptionExpanded(false);
                      }}
                      className="block mt-2 font-bold opacity-80 hover:opacity-100 transition-opacity text-sm text-gray-300"
                    >
                      See less
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Scroll Hint Overlay (Only on mobile) */}
          <div className="absolute right-4 bottom-1/4 sm:hidden flex flex-col gap-2 items-center pointer-events-none opacity-50 animate-bounce">
            <div className="w-8 h-8 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </svg>
            </div>
            <span className="text-white text-[10px] uppercase font-bold tracking-wider drop-shadow-md">Scroll</span>
          </div>

          <div className="absolute inset-0 -z-10" onClick={() => setSelectedReel(null)} />
        </div>
      )}
    </section>
  );
};
