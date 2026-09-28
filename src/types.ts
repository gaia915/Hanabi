export type Platform = 'youtube' | 'youtube_shorts' | 'tiktok' | 'instagram';

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
  viewCount: number;
  commentCount: number;
}

export interface TopVideoInfo {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  commentCount: number;
  videoUrl: string;
  publishedAt: string;
}

export interface ChannelStats {
  id: string;
  name: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  url: string;
  thumbnailUrl: string;
  videoCount: number;
  totalViews: number;
  totalComments: number;
  averageViews: number;
  mainCategory: string;
  rankByViews: number;
  rankByComments: number;
  rankByAverageViews?: number;
  engagementRate?: number;
  channelType?: 'official' | 'creator' | 'tiktoker' | 'media';
  videoIds?: string[];
  topVideo?: TopVideoInfo | null;
  latestPublishedAt?: string;
}

export interface AggregatorStats {
  lastUpdated: string;
  totalVideos: number;
  totalChannels: number;
  totalViews: number;
  totalComments: number;
  platforms: {
    youtube: number;
    youtube_shorts: number;
    tiktok: number;
    instagram?: number;
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
  viewCount?: number;
  commentCount?: number;
}

export interface SourceInstagram {
  url: string;
  title?: string;
  category?: string;
  region?: string;
  author_name?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  commentCount?: number;
}
