import React from 'react';
import type { HanabiVideo } from '../types';
import { Play, ExternalLink, Bookmark, MapPin, Calendar } from 'lucide-react';
import { YoutubeIcon, TikTokIcon } from './Icons';

interface VideoCardProps {
  video: HanabiVideo;
  onPlay: (video: HanabiVideo) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  const formattedDate = (() => {
    try {
      const d = new Date(video.publishedAt);
      return d.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  })();

  const isTikTok = video.platform === 'tiktok';
  const isShorts = video.platform === 'youtube_shorts';

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-spark-coral/10">
      
      {/* Thumbnail Area */}
      <div 
        className="relative aspect-video w-full bg-night-900 cursor-pointer overflow-hidden"
        onClick={() => onPlay(video)}
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-transparent to-black/30 pointer-events-none" />

        {/* Platform Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {isTikTok ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-black/80 text-cyan-300 border border-cyan-400/30 backdrop-blur-sm">
              <TikTokIcon className="w-2.5 h-2.5 text-cyan-400" />
              TikTok
            </span>
          ) : isShorts ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-red-600/90 text-white backdrop-blur-sm shadow-sm">
              <Play className="w-2.5 h-2.5 fill-current" />
              Shorts
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-red-600/90 text-white backdrop-blur-sm shadow-sm">
              <YoutubeIcon className="w-3 h-3" />
              YouTube
            </span>
          )}

          {/* 4K / 8K Badge */}
          {video.tags.some(t => t.toUpperCase() === '4K' || t.toUpperCase() === '8K') && (
            <span className="px-1.5 py-0.5 text-[10px] font-black rounded bg-spark-gold/90 text-night-950 backdrop-blur-sm">
              4K
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(video.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-spark-coral text-white shadow-lg shadow-spark-coral/40 scale-110'
              : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70'
          }`}
          title={isFavorite ? 'お気に入り解除' : 'お気に入りに追加'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-spark-coral text-white flex items-center justify-center shadow-xl shadow-spark-coral/50 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Details Overlay on Thumbnail */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1 font-medium bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-spark-gold" />
            {video.category}
          </span>
          {formattedDate && (
            <span className="flex items-center gap-1 text-slate-300 bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
              <Calendar className="w-2.5 h-2.5" />
              {formattedDate}
            </span>
          )}
        </div>

      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Title */}
          <h3 
            onClick={() => onPlay(video)}
            className="text-sm font-bold text-slate-100 line-clamp-2 hover:text-spark-gold cursor-pointer transition-colors leading-snug"
            title={video.title}
          >
            {video.title}
          </h3>

          {/* Author */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <a
              href={video.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-spark-cyan truncate max-w-[200px] transition-colors"
            >
              {video.authorName}
            </a>
            
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white p-1 transition-colors"
              title="元プラットフォームで視聴"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
            {video.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded bg-night-800 text-slate-400 border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
