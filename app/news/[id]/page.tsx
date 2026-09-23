import { Metadata, ResolvingMetadata } from 'next';
import Script from 'next/script';
import Home from '@/app/page';

export async function generateStaticParams() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !token) {
    return [];
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${pageId}/video_reels?fields=id&limit=50&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) {
        // Fallback for token exchange to ensure build succeeds
        const exchangeUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=access_token&access_token=${token}`;
        const exchangeRes = await fetch(exchangeUrl);
        const exchangeData = await exchangeRes.json();
        if (exchangeData.access_token) {
           const newUrl = `https://graph.facebook.com/v19.0/${pageId}/video_reels?fields=id&limit=50&access_token=${exchangeData.access_token}`;
           const newRes = await fetch(newUrl);
           const newData = await newRes.json();
           if (newData.data) {
             return newData.data.map((reel: any) => ({ id: reel.id }));
           }
        }
        return [];
    }
    
    const data = await res.json();
    if (!data.data) return [];
    
    return data.data.map((reel: any) => ({
      id: reel.id,
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!token) return {};

  try {
    const url = `https://graph.facebook.com/v19.0/${id}?fields=description,created_time,picture,thumbnails,permalink_url&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    
    const reel = await res.json();
    const title = reel.description ? reel.description.split('\n')[0] : 'Ada Media News';
    const description = reel.description || 'Ada Media News';
    let imageUrl = reel.picture;
    if (reel.thumbnails?.data?.length > 0) {
       const sorted = [...reel.thumbnails.data].sort((a: any, b: any) => b.height - a.height);
       imageUrl = sorted[0].uri;
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl }],
        type: 'article',
        publishedTime: reel.created_time,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      }
    };
  } catch (error) {
    return {};
  }
}

export default async function NewsPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  let reel = null;
  let title = "Ada Media News";
  let description = "";
  let imageUrl = "";
  
  if (token) {
    try {
      const url = `https://graph.facebook.com/v19.0/${id}?fields=description,created_time,picture,thumbnails,permalink_url&access_token=${token}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        reel = await res.json();
        title = reel.description ? reel.description.split('\n')[0] : 'Ada Media News';
        description = reel.description || '';
        imageUrl = reel.picture;
        if (reel.thumbnails?.data?.length > 0) {
           const sorted = [...reel.thumbnails.data].sort((a: any, b: any) => b.height - a.height);
           imageUrl = sorted[0].uri;
        }
      }
    } catch (e) {}
  }

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        headline: title,
        description: description,
        inLanguage: "si-LK",
        image: [imageUrl],
        datePublished: reel?.created_time || new Date().toISOString(),
        dateModified: reel?.created_time || new Date().toISOString(),
        author: {
            '@type': 'Person',
            name: 'Ada Media Reporter',
            url: 'https://adamedia.lk'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Ada Media',
          logo: {
            '@type': 'ImageObject',
            url: 'https://adamedia.lk/Ada%20Media%20News.png'
          }
        }
      },
      {
        '@type': 'VideoObject',
        name: title,
        description: description,
        inLanguage: "si-LK",
        thumbnailUrl: imageUrl,
        uploadDate: reel?.created_time || new Date().toISOString(),
        contentUrl: reel?.permalink_url || `https://adamedia.lk/news/${id}`,
        embedUrl: `https://adamedia.lk/news/${id}`,
        publisher: {
          '@type': 'Organization',
          name: 'Ada Media',
          logo: {
            '@type': 'ImageObject',
            url: 'https://adamedia.lk/Ada%20Media%20News.png'
          }
        }
      },
      {
        '@type': 'BreadcrumbList',
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://adamedia.lk"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "News Reels",
            "item": "https://adamedia.lk/#reels"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": `https://adamedia.lk/news/${id}`
          }
        ]
      }
    ]
  };

  return (
    <>
      {reel && (
        <Script
          id={`news-schema-${id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Render the full homepage, the client component will read the URL to open the modal */}
      <Home />
      {/* Hidden transcription for SEO bots */}
      {reel && reel.description && (
        <article className="sr-only" aria-hidden="true">
          <time dateTime={reel.created_time}>{new Date(reel.created_time).toLocaleDateString('si-LK')}</time>
          <div dangerouslySetInnerHTML={{ __html: reel.description.replace(/\n/g, '<br/>') }} />
        </article>
      )}
    </>
  );
}
