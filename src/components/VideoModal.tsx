import React, { useEffect } from 'react';
import type { HanabiVideo } from '../types';
import { X, ExternalLink, Bookmark, MapPin, Calendar, Share2 } from 'lucide-react';

interface VideoModalProps {
  video: HanabiVideo | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenChannel?: (channelName: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenChannel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (video) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const isTikTok = video.platform === 'tiktok';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: video.videoUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(video.videoUrl);
      alert('動画URLをクリップボードにコピーしました！');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl bg-night-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-night-950/60">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-spark-coral/20 text-spark-coral border border-spark-coral/30">
              {video.category}
            </span>
            <span className="text-xs text-slate-400 truncate hidden sm:inline">
              {video.authorName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(video.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-spark-coral text-white border-spark-coral shadow-md shadow-spark-coral/30'
                  : 'bg-night-800 text-slate-300 border-white/10 hover:text-white'
              }`}
              title="お気に入り"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-night-800 text-slate-300 border border-white/10 hover:text-white transition-all"
              title="シェア / URLコピー"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-night-800 text-slate-300 border border-white/10 hover:text-white transition-all"
              title="元プラットフォームで開く"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-night-800 hover:bg-night-700 text-slate-400 hover:text-white transition-all ml-1"
              title="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="relative bg-black flex items-center justify-center w-full">
          {isTikTok ? (
            <div className="w-full flex justify-center py-4 bg-night-950">
              <iframe
                src={`https://www.tiktok.com/embed/v2/${video.original_id}`}
                title={video.title}
                className="w-full max-w-[340px] h-[580px] rounded-xl border border-white/10 shadow-2xl"
                allowFullScreen
                allow="autoplay; encrypted-media;"
              />
            </div>
          ) : (
            <div className="w-full aspect-video">
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Details Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 bg-night-900/90">
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {video.title}
          </h2>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-spark-coral" />
              投稿チャンネル: 
              {onOpenChannel ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenChannel(video.authorName);
                  }}
                  className="text-spark-gold hover:underline font-bold flex items-center gap-1"
                >
                  {video.authorName}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-spark-gold/20 text-spark-gold">集計を見る</span>
                </button>
              ) : (
                <a href={video.authorUrl} target="_blank" rel="noopener noreferrer" className="hover:text-spark-cyan underline">{video.authorName}</a>
              )}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-spark-gold" />
              {video.category} ({video.region})
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {new Date(video.publishedAt).toLocaleDateString('ja-JP')}
            </span>
          </div>

          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-lg bg-night-800 text-slate-300 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {video.description && (
            <p className="text-xs text-slate-400 bg-night-950/60 p-3 rounded-xl border border-white/5 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
