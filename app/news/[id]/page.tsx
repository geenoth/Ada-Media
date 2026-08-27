import { Metadata, ResolvingMetadata } from 'next';
import Script from 'next/script';
import Home from '@/app/page';

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
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: [imageUrl],
    datePublished: reel?.created_time || new Date().toISOString(),
    author: [{
        '@type': 'Organization',
        name: 'Ada Media',
        url: 'https://adamedia.lk'
    }]
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
    </>
  );
}
