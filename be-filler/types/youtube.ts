
export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
}

export interface YouTubeSearchResponse {
    items: {
        id: { videoId: string };
        snippet: {
            title: string;
            description: string;
            thumbnails: { high: { url: string } };
        };
    }[];
}

export interface YouTubeChannelResponse {
    items: { id: string }[];
}