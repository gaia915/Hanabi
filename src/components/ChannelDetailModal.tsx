import React, { useEffect } from 'react';
import type { ChannelStats, HanabiVideo } from '../types';
import { X, ExternalLink, Eye, MessageSquare, Video, Sparkles, MapPin, Play, TrendingUp, Award } from 'lucide-react';
import { YoutubeIcon, TikTokIcon } from './Icons';

interface ChannelDetailModalProps {
  channel: ChannelStats | null;
  videos: HanabiVideo[];
  onClose: () => void;
  onPlayVideo: (video: HanabiVideo) => void;
}

export const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
  channel,
  videos,
  onClose,
  onPlayVideo,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (channel) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [channel, onClose]);

  if (!channel) return null;

  // このチャンネルに属する動画を抽出
  const channelVideos = videos.filter(v => 
    v.authorName === channel.name || 
    (channel.videoIds && channel.videoIds.includes(v.id))
  ).sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

  const formatNumber = (num?: number): string => {
    if (!num) return '0';
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}億`;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    return num.toLocaleString();
  };

  const isTikTok = channel.platform === 'tiktok';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-5xl bg-night-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-white/10 bg-gradient-to-r from-night-950 via-night-900 to-night-950 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-spark-coral/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-10 w-60 h-60 bg-spark-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            
            <div className="flex items-center gap-4">
              <img
                src={channel.thumbnailUrl}
                alt={channel.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-xl border-2 border-white/10 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {channel.name}
                  </h2>
                  {isTikTok ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-black/80 text-cyan-300 border border-cyan-400/30">
                      <TikTokIcon className="w-3 h-3" />
                      TikTok
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-600/90 text-white">
                      <YoutubeIcon className="w-3 h-3" />
                      YouTube
                    </span>
                  )}
                  {channel.channelType === 'official' && (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-spark-gold/20 text-spark-gold border border-spark-gold/30">
                      大会公式組織
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-spark-coral" />
                    主カテゴリ: <strong className="text-slate-200">{channel.mainCategory}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-spark-gold" />
                    PV順位: <strong className="text-spark-gold">第{channel.rankByViews}位</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    コメント順位: <strong className="text-slate-200">第{channel.rankByComments}位</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-night-800 hover:bg-night-700 text-slate-200 border border-white/10 hover:border-white/25 transition-all"
              >
                公式チャンネルを開く
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-night-800 hover:bg-night-700 text-slate-400 hover:text-white transition-all"
                title="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Channel Analytics Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 bg-night-950/70 border-b border-white/5">
          <div className="p-3.5 rounded-xl bg-night-900/90 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-spark-gold" />
              累計ページビュー (PV)
            </span>
            <div className="text-lg sm:text-xl font-black text-spark-gold">
              {formatNumber(channel.totalViews)} <span className="text-xs font-normal text-slate-400">回</span>
            </div>
            <div className="text-[10px] text-slate-400">
              実測総数: {channel.totalViews.toLocaleString()}回
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-night-900/90 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-spark-coral" />
              総コメント数
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-100">
              {channel.totalComments.toLocaleString()} <span className="text-xs font-normal text-slate-400">件</span>
            </div>
            <div className="text-[10px] text-slate-400">
              反響順位: 第{channel.rankByComments}位
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-night-900/90 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-spark-cyan" />
              平均再生数 / 本
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-100">
              {formatNumber(channel.averageViews)} <span className="text-xs font-normal text-slate-400">回</span>
            </div>
            <div className="text-[10px] text-slate-400">
              登録本数: {channelVideos.length}本
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-night-900/90 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-spark-purple" />
              エンゲージメント率
            </span>
            <div className="text-lg sm:text-xl font-black text-spark-purple">
              {channel.engagementRate ? `${channel.engagementRate}%` : '0.08%'}
            </div>
            <div className="text-[10px] text-slate-400">
              コメント / PV 比率
            </div>
          </div>
        </div>

        {/* Video Archive of this channel */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-spark-coral" />
              このチャンネルの花火動画一覧 ({channelVideos.length}本)
            </h3>
            <span className="text-xs text-slate-400">
              再生数が多い順に表示しています
            </span>
          </div>

          {channelVideos.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              現在登録されている動画がありません。
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {channelVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => onPlayVideo(video)}
                  className="group glass-card rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-spark-coral/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-night-950 overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-transparent to-transparent pointer-events-none" />

                    {/* Play button hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-10 h-10 rounded-full bg-spark-coral text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-300">
                      <span className="bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {video.category}
                      </span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {new Date(video.publishedAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-2 group-hover:text-spark-gold transition-colors">
                      {video.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1 text-spark-gold font-semibold">
                        <Eye className="w-3 h-3" />
                        {formatNumber(video.viewCount)}回 PV
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        {video.commentCount?.toLocaleString() || 0}件
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-night-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>チャンネルID: {channel.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-night-800 hover:bg-night-700 text-slate-300 transition-colors"
          >
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
};
