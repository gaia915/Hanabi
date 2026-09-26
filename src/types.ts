export type Platform = 'youtube' | 'youtube_shorts' | 'tiktok';

export interface HanabiVideo {
  id: string;
  original_id: string;
  title: string;
  platform: Platform;
  videoUrl: string;
  embedUrl: string;
  embedHtml?: string | null;
  authorName: string;
  authorUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
  category: string;
  region: string;
  tags: string[];
  description: string;
}

export interface AggregatorStats {
  lastUpdated: string;
  totalVideos: number;
  platforms: {
    youtube: number;
    youtube_shorts: number;
    tiktok: number;
  };
  categories: Record<string, number>;
}

export interface SourceChannel {
  name: string;
  channel_id: string;
  handle?: string;
  default_category: string;
  default_region: string;
}

export interface SourceQuery {
  query: string;
  default_category: string;
  max_results: number;
}

export interface SourceTikTok {
  url: string;
  title?: string;
  category?: string;
  region?: string;
  author_name?: string;
  thumbnailUrl?: string;
}
