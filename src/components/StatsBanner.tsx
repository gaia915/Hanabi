import React from 'react';
import { RefreshCw, PlaySquare, Film, Video, Calendar, Eye, MessageSquare } from 'lucide-react';
import type { AggregatorStats } from '../types';

interface StatsBannerProps {
  stats: AggregatorStats | null;
  onRefreshClick?: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats, onRefreshClick }) => {
  if (!stats) return null;

  const formattedDate = (() => {
    try {
      const d = new Date(stats.lastUpdated);
      return d.toLocaleString('ja-JP', {
        year: 'numeric',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-white/10 shadow-xl">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-spark-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-spark-purple/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          
          {/* Main Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                自動巡回中
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                最終更新: <strong className="text-slate-200">{formattedDate}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              全国の花火動画ライブラリ
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              YouTube公式チャンネル・4K検索クエリ・TikTokから最新の花火動画を自動収集・分類。
              GitHub Actionsによる定期Cronで常に最新の映像がアップデートされます。
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-night-900/80 border border-white/5 shadow-sm">
              <div className="p-1.5 rounded-lg bg-spark-gold/15 text-spark-gold">
                <Video className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">登録動画</div>
                <div className="text-xs font-bold text-white">{stats.totalVideos} <span className="font-normal text-slate-400">本</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-night-900/80 border border-white/5 shadow-sm">
              <div className="p-1.5 rounded-lg bg-spark-gold/20 text-spark-gold">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">総再生数 (PV)</div>
                <div className="text-xs font-bold text-spark-gold">
                  {stats.totalViews ? (stats.totalViews >= 10000 ? `${(stats.totalViews / 10000).toFixed(0)}万` : stats.totalViews.toLocaleString()) : '0'} <span className="font-normal text-slate-400">回</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-night-900/80 border border-white/5 shadow-sm">
              <div className="p-1.5 rounded-lg bg-spark-coral/20 text-spark-coral">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">総コメント</div>
                <div className="text-xs font-bold text-slate-200">
                  {stats.totalComments?.toLocaleString() || 0} <span className="font-normal text-slate-400">件</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-night-900/80 border border-white/5 shadow-sm">
              <div className="p-1.5 rounded-lg bg-red-500/15 text-red-400">
                <PlaySquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">YouTube</div>
                <div className="text-xs font-bold text-white">{stats.platforms.youtube + stats.platforms.youtube_shorts} <span className="font-normal text-slate-400">本</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-night-900/80 border border-white/5 shadow-sm">
              <div className="p-1.5 rounded-lg bg-pink-500/15 text-pink-400">
                <Film className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">TikTok</div>
                <div className="text-xs font-bold text-white">{stats.platforms.tiktok} <span className="font-normal text-slate-400">本</span></div>
              </div>
            </div>

            {onRefreshClick && (
              <button
                onClick={onRefreshClick}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-night-800 hover:bg-night-700 text-slate-300 border border-white/10 hover:border-white/20 transition-all ml-auto lg:ml-0"
                title="ローカル最新化コマンド"
              >
                <RefreshCw className="w-3.5 h-3.5 text-spark-cyan" />
                更新コマンド確認
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
