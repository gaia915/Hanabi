import React from 'react';
import type { AggregatorStats, ChannelStats } from '../types';
import { Eye, MessageSquare, Video, Trophy, Calendar, Flame } from 'lucide-react';

interface ChannelHeroProps {
  stats: AggregatorStats | null;
  topChannel: ChannelStats | null;
  onSelectChannel: (channel: ChannelStats) => void;
  onOpenGuideModal: () => void;
}

export const ChannelHero: React.FC<ChannelHeroProps> = ({
  stats,
  topChannel,
  onSelectChannel,
  onOpenGuideModal,
}) => {
  if (!stats) return null;

  const formatLargeNumber = (num?: number): string => {
    if (!num) return '0';
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(2)}億`;
    }
    if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}万`;
    }
    return num.toLocaleString();
  };

  const formattedDate = (() => {
    try {
      const d = new Date(stats.lastUpdated);
      return d.toLocaleString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return stats.lastUpdated;
    }
  })();

  return (
    <div className="relative overflow-hidden pt-6 pb-4">
      {/* Background Neon Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-spark-coral/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-spark-purple/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-night-950 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Main Title Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spark-coral/15 text-spark-coral text-xs font-bold border border-spark-coral/30">
                <span className="w-2 h-2 rounded-full bg-spark-coral animate-ping" />
                チャンネル集計・分析ポータル
              </span>
              <button
                onClick={onOpenGuideModal}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-night-900/60 px-2.5 py-0.5 rounded-full border border-white/5 hover:border-white/20 transition-all"
                title="自動更新の仕組みを開く"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                自動更新: <strong className="text-slate-200">{formattedDate}</strong>
              </button>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              日本の花火チャンネルを
              <br />
              <span className="bg-gradient-to-r from-spark-gold via-spark-coral to-spark-cyan bg-clip-text text-transparent">
                総再生数＆コメント数
              </span>
              で徹底分析
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              長岡花火・大曲の花火などの公式チャンネルから、4K映像作家、TikTok・Instagramクリエイターまで。
              各チャンネルの累計ページビュー（PV）や反響コメント数を自動集計・ランキング化しています。
            </p>
          </div>

          {/* Top Channel Quick Highlight */}
          {topChannel && (
            <div 
              onClick={() => onSelectChannel(topChannel)}
              className="glass-card rounded-2xl p-4 border border-spark-gold/30 bg-gradient-to-br from-spark-gold/10 via-night-900 to-night-950 cursor-pointer hover:border-spark-gold/60 transition-all shadow-xl group shrink-0 lg:max-w-xs w-full"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="flex items-center gap-1 text-spark-gold font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  PVランキング総合第1位
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">
                  詳細を見る →
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={topChannel.thumbnailUrl}
                  alt={topChannel.name}
                  className="w-12 h-12 rounded-xl object-cover border border-spark-gold/40 shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-spark-gold transition-colors">
                    {topChannel.name}
                  </h4>
                  <div className="text-xs text-spark-gold font-bold mt-0.5">
                    総PV: {formatLargeNumber(topChannel.totalViews)}回
                  </div>
                  <div className="text-[10px] text-slate-400">
                    コメント {topChannel.totalComments.toLocaleString()}件 / 動画 {topChannel.videoCount}本
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Big Dashboard Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
          
          {/* Total Channels */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-spark-cyan/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">集計チャンネル数</span>
              <div className="p-2 rounded-xl bg-spark-cyan/15 text-spark-cyan group-hover:scale-110 transition-transform">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.totalChannels || 28}
              </span>
              <span className="text-xs text-slate-400 font-medium">チャンネル</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              YouTube公式 / 映像作家 / TikTok / Instagram
            </div>
          </div>

          {/* Total Views */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-spark-gold/30 bg-spark-gold/[0.03] hover:border-spark-gold/60 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">全チャンネル 累計PV</span>
              <div className="p-2 rounded-xl bg-spark-gold/20 text-spark-gold group-hover:scale-110 transition-transform">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-spark-gold">
                {formatLargeNumber(stats.totalViews)}
              </span>
              <span className="text-xs text-slate-400 font-medium">回 再生</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              実測総数: {stats.totalViews.toLocaleString()} PV
            </div>
          </div>

          {/* Total Comments */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-spark-coral/30 bg-spark-coral/[0.03] hover:border-spark-coral/60 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">全チャンネル 累計コメント</span>
              <div className="p-2 rounded-xl bg-spark-coral/20 text-spark-coral group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-100">
                {stats.totalComments.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">件の反響</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              視聴者の熱狂・感動コメント総数
            </div>
          </div>

          {/* Total Videos */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-spark-purple/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">登録花火動画</span>
              <div className="p-2 rounded-xl bg-spark-purple/15 text-spark-purple group-hover:scale-110 transition-transform">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.totalVideos}
              </span>
              <span className="text-xs text-slate-400 font-medium">本</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
              <span>YT: {stats.platforms.youtube + stats.platforms.youtube_shorts}本</span>
              <span>TT: {stats.platforms.tiktok}本</span>
              {typeof stats.platforms.instagram === 'number' && <span>IG: {stats.platforms.instagram}本</span>}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
