import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    let token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageId || !token) {
      console.error("Missing FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after');
    const id = searchParams.get('id');
    const paginationQuery = after ? `&after=${after}` : '';

    // Attempt 1: Try to fetch reels directly (assuming token is a Page Token)
    let url = id 
      ? `https://graph.facebook.com/v19.0/${id}?fields=id,description,created_time,source,picture,thumbnails,permalink_url&access_token=${token}`
      : `https://graph.facebook.com/v19.0/${pageId}/video_reels?fields=id,description,created_time,source,picture,thumbnails,permalink_url&limit=12${paginationQuery}&access_token=${token}`;
    
    let res = await fetch(url, { next: { revalidate: 3600 } });
    let data = await res.json();
    
    // Normalize single reel response to match the grid format
    if (id && !data.error) {
      data = { data: [data] };
    }

    // If it fails because a Page Token is required, try to exchange the User Token for a Page Token
    if (!res.ok && data.error && (data.error.code === 190 || (data.error.error_user_msg && data.error.error_user_msg.includes("Page access token is required")))) {
      console.log("User token detected. Attempting to exchange for Page Access Token...");
      const exchangeUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=access_token&access_token=${token}`;
      const exchangeRes = await fetch(exchangeUrl);
      const exchangeData = await exchangeRes.json();

      if (exchangeData.access_token) {
        // Success! Use the newly retrieved Page Token
        token = exchangeData.access_token;
        url = id 
          ? `https://graph.facebook.com/v19.0/${id}?fields=id,description,created_time,source,picture,thumbnails,permalink_url&access_token=${token}`
          : `https://graph.facebook.com/v19.0/${pageId}/video_reels?fields=id,description,created_time,source,picture,thumbnails,permalink_url&limit=12${paginationQuery}&access_token=${token}`;
          
        res = await fetch(url, { next: { revalidate: 3600 } });
        data = await res.json();
        
        if (id && !data.error) {
          data = { data: [data] };
        }
      } else {
        console.error("Failed to exchange User Token for Page Token:", exchangeData);
      }
    }

    if (!res.ok) {
      console.error("Facebook API Error:", data);
      return NextResponse.json(
        { error: "Failed to fetch reels from Facebook", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/reels:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
