import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  
  const baseUrl = 'https://adamedia.lk';
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    }
  ];

  if (pageId && token) {
    try {
      // Fetch up to 50 recent reels for the sitemap
      const url = `https://graph.facebook.com/v19.0/${pageId}/video_reels?fields=id,created_time&limit=50&access_token=${token}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      
      if (res.ok) {
        let data = await res.json();
        
        // Handle token exchange if necessary
        if (data.error && (data.error.code === 190 || (data.error.error_user_msg && data.error.error_user_msg.includes("Page access token is required")))) {
           const exchangeUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=access_token&access_token=${token}`;
           const exchangeRes = await fetch(exchangeUrl);
           const exchangeData = await exchangeRes.json();
           if (exchangeData.access_token) {
               const newToken = exchangeData.access_token;
               const newUrl = `https://graph.facebook.com/v19.0/${pageId}/video_reels?fields=id,created_time&limit=50&access_token=${newToken}`;
               const newRes = await fetch(newUrl, { next: { revalidate: 3600 } });
               if (newRes.ok) data = await newRes.json();
           }
        }
        
        if (data.data) {
          const reelRoutes: MetadataRoute.Sitemap = data.data.map((reel: { id: string, created_time: string }) => ({
            url: `${baseUrl}/news/${reel.id}`,
            lastModified: reel.created_time || new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 0.8,
          }));
          routes.push(...reelRoutes);
        }
      }
    } catch (e) {
      console.error("Failed to generate sitemap for reels:", e);
    }
  }

  return routes;
}
