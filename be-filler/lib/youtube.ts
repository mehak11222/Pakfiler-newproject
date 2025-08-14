
import { Video, YouTubeSearchResponse, YouTubeChannelResponse } from '@/types/youtube';

export async function fetchChannelId(apiKey: string, handle: string): Promise<string | null> {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handle}&key=${apiKey}`,
            { next: { revalidate: 86400 } } // Cache for 24 hours
        );
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data: YouTubeChannelResponse = await response.json();
        return data.items[0]?.id || null;
    } catch (err) {
        console.error('Error fetching channel ID:', err);
        return null;
    }
}

export async function fetchYouTubeVideos(apiKey: string, channelId: string, query: string): Promise<Video[]> {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(
                query
            )}&key=${apiKey}&maxResults=10&type=video`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data: YouTubeSearchResponse = await response.json();
        return data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));
    } catch (err) {
        console.error(`Error fetching videos for query "${query}":`, err);
        return [];
    }
}