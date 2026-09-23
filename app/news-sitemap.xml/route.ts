import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  
  if (!pageId || !token) {
    return new NextResponse('Missing env variables', { status: 500 });
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${pageId}/video_reels?fields=id,description,created_time&limit=25&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (res.ok) {
      let data = await res.json();
      
      // Token Exchange if needed
      if (data.error) {
           const exchangeUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=access_token&access_token=${token}`;
           const exchangeRes = await fetch(exchangeUrl);
           const exchangeData = await exchangeRes.json();
           if (exchangeData.access_token) {
               const newUrl = `https://graph.facebook.com/v19.0/${pageId}/video_reels?fields=id,description,created_time&limit=25&access_token=${exchangeData.access_token}`;
               const newRes = await fetch(newUrl, { next: { revalidate: 3600 } });
               if (newRes.ok) data = await newRes.json();
           }
      }

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

      if (data.data) {
        // Google News only accepts articles from last 48 hours
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        data.data.forEach((reel: any) => {
          const reelDate = new Date(reel.created_time);
          if (reelDate >= twoDaysAgo) {
            xml += `
  <url>
    <loc>https://adamedia.lk/news/${reel.id}</loc>
    <news:news>
      <news:publication>
        <news:name>Ada Media</news:name>
        <news:language>si</news:language>
      </news:publication>
      <news:publication_date>${reel.created_time}</news:publication_date>
      <news:title><![CDATA[${(reel.description || 'Facebook Reel News').substring(0, 100).replace(/[\n\r]+/g, ' ')}]]></news:title>
    </news:news>
  </url>`;
          }
        });
      }

      xml += `
</urlset>`;

      return new NextResponse(xml, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    }
  } catch (error) {
    console.error("Error generating news sitemap:", error);
  }
  
  return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
    headers: { 'Content-Type': 'application/xml' }
  });
}
