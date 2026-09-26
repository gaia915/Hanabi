import React, { useState, useMemo } from 'react';
import type { ChannelStats } from '../types';
import { Trophy, Eye, MessageSquare, Video, ExternalLink, Flame, ArrowUpRight } from 'lucide-react';
import { YoutubeIcon, TikTokIcon } from './Icons';

interface ChannelRankingProps {
  channels: ChannelStats[];
  onSelectChannel: (channelName: string) => void;
}

export const ChannelRanking: React.FC<ChannelRankingProps> = ({
  channels,
  onSelectChannel,
}) => {
  const [rankingMetric, setRankingMetric] = useState<'views' | 'comments' | 'videos'>('views');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'youtube' | 'tiktok'>('all');

  const formatNumber = (num: number): string => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}億`;
    }
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toLocaleString();
  };

  const filteredChannels = useMemo(() => {
    let list = [...channels];
    if (platformFilter !== 'all') {
      list = list.filter(c => c.platform === platformFilter);
    }

    if (rankingMetric === 'views') {
      list.sort((a, b) => b.totalViews - a.totalViews);
    } else if (rankingMetric === 'comments') {
      list.sort((a, b) => b.totalComments - a.totalComments);
    } else {
      list.sort((a, b) => b.videoCount - a.videoCount);
    }
    return list;
  }, [channels, rankingMetric, platformFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
      
      {/* Ranking Header & Controls */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-spark-gold/20 text-spark-gold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                花火チャンネル ランキング
                <span className="text-xs px-2 py-0.5 rounded-full bg-spark-coral/20 text-spark-coral font-medium border border-spark-coral/30">
                  全{channels.length}チャンネル集計
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                各チャンネルの総再生数（PV）・総コメント数・登録動画数を集計したランキングです
              </p>
            </div>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-night-950 p-1 border border-white/10">
            <button
              onClick={() => setRankingMetric('views')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                rankingMetric === 'views'
                  ? 'bg-spark-gold text-night-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              総再生数 (PV) 順
            </button>
            <button
              onClick={() => setRankingMetric('comments')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                rankingMetric === 'comments'
                  ? 'bg-spark-coral text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              総コメント数順
            </button>
            <button
              onClick={() => setRankingMetric('videos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                rankingMetric === 'videos'
                  ? 'bg-spark-cyan text-night-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              動画本数順
            </button>
          </div>

          {/* Platform filter */}
          <div className="flex rounded-xl bg-night-950 p-1 border border-white/10">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                platformFilter === 'all' ? 'bg-night-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              全て
            </button>
            <button
              onClick={() => setPlatformFilter('youtube')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                platformFilter === 'youtube' ? 'bg-red-600/30 text-red-300 border border-red-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <YoutubeIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                platformFilter === 'tiktok' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TikTokIcon className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Top 3 Podium Highlights */}
      {filteredChannels.length >= 3 && rankingMetric === 'views' && platformFilter === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 2nd Place */}
          <div className="glass-card rounded-2xl p-5 border border-slate-400/20 relative order-2 md:order-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 flex items-center justify-center font-black text-sm">
                2
              </span>
              <span className="text-xs text-slate-400">第2位</span>
            </div>
            <div className="my-4 text-center">
              <img
                src={filteredChannels[1].thumbnailUrl}
                alt={filteredChannels[1].name}
                className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-lg border border-white/10 mb-3"
              />
              <h3 className="font-bold text-white text-base truncate" title={filteredChannels[1].name}>
                {filteredChannels[1].name}
              </h3>
              <p className="text-xs text-spark-gold font-bold mt-1">
                総PV: {formatNumber(filteredChannels[1].totalViews)}回
              </p>
              <p className="text-[11px] text-slate-400">
                コメント: {filteredChannels[1].totalComments.toLocaleString()}件 / 動画 {filteredChannels[1].videoCount}本
              </p>
            </div>
            <button
              onClick={() => onSelectChannel(filteredChannels[1].name)}
              className="w-full py-2 text-xs font-semibold rounded-xl bg-night-800 hover:bg-night-700 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1"
            >
              動画を見る ({filteredChannels[1].videoCount}本)
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1st Place */}
          <div className="glass-card rounded-2xl p-6 border-2 border-spark-gold/50 bg-gradient-to-b from-spark-gold/10 to-night-900/90 relative order-1 md:order-2 flex flex-col justify-between shadow-2xl shadow-spark-gold/10 -translate-y-1">
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-full bg-spark-gold text-night-950 flex items-center justify-center font-black text-base shadow-lg shadow-spark-gold/40">
                👑 1
              </span>
              <span className="text-xs font-bold text-spark-gold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                第1位 チャンピオン
              </span>
            </div>
            <div className="my-4 text-center">
              <img
                src={filteredChannels[0].thumbnailUrl}
                alt={filteredChannels[0].name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto shadow-xl border-2 border-spark-gold/60 mb-3 ring-4 ring-spark-gold/20"
              />
              <h3 className="font-extrabold text-white text-lg truncate" title={filteredChannels[0].name}>
                {filteredChannels[0].name}
              </h3>
              <div className="mt-1.5 flex items-center justify-center gap-2">
                <span className="text-sm text-spark-gold font-black bg-spark-gold/20 px-3 py-0.5 rounded-full border border-spark-gold/30">
                  総PV: {formatNumber(filteredChannels[0].totalViews)}回
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                総コメント数: <strong className="text-white">{filteredChannels[0].totalComments.toLocaleString()}</strong> 件
              </p>
            </div>
            <button
              onClick={() => onSelectChannel(filteredChannels[0].name)}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-spark-gold to-spark-coral text-night-950 shadow-lg shadow-spark-gold/20 hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
            >
              1位の動画を見る ({filteredChannels[0].videoCount}本)
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3rd Place */}
          <div className="glass-card rounded-2xl p-5 border border-amber-600/30 relative order-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 border border-amber-600/40 flex items-center justify-center font-black text-sm">
                3
              </span>
              <span className="text-xs text-slate-400">第3位</span>
            </div>
            <div className="my-4 text-center">
              <img
                src={filteredChannels[2].thumbnailUrl}
                alt={filteredChannels[2].name}
                className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-lg border border-white/10 mb-3"
              />
              <h3 className="font-bold text-white text-base truncate" title={filteredChannels[2].name}>
                {filteredChannels[2].name}
              </h3>
              <p className="text-xs text-spark-gold font-bold mt-1">
                総PV: {formatNumber(filteredChannels[2].totalViews)}回
              </p>
              <p className="text-[11px] text-slate-400">
                コメント: {filteredChannels[2].totalComments.toLocaleString()}件 / 動画 {filteredChannels[2].videoCount}本
              </p>
            </div>
            <button
              onClick={() => onSelectChannel(filteredChannels[2].name)}
              className="w-full py-2 text-xs font-semibold rounded-xl bg-night-800 hover:bg-night-700 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1"
            >
              動画を見る ({filteredChannels[2].videoCount}本)
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Full Ranking Table / Cards */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="px-5 py-3.5 bg-night-950/60 border-b border-white/10 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <div className="w-12 text-center">順位</div>
          <div className="flex-1 px-4">チャンネル情報</div>
          <div className="w-28 text-right hidden sm:block">総PV (再生回数)</div>
          <div className="w-24 text-right hidden md:block">総コメント数</div>
          <div className="w-20 text-center hidden lg:block">登録本数</div>
          <div className="w-28 text-right">アクション</div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredChannels.map((channel, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={channel.id}
                className={`flex items-center justify-between px-5 py-4 transition-colors ${
                  isTop3 ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Rank Badge */}
                <div className="w-12 flex justify-center">
                  {rank === 1 ? (
                    <span className="w-8 h-8 rounded-full bg-spark-gold text-night-950 flex items-center justify-center font-black text-sm shadow-md shadow-spark-gold/30">
                      1
                    </span>
                  ) : rank === 2 ? (
                    <span className="w-7 h-7 rounded-full bg-slate-300 text-night-950 flex items-center justify-center font-bold text-xs shadow-md">
                      2
                    </span>
                  ) : rank === 3 ? (
                    <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                      3
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">
                      {rank}
                    </span>
                  )}
                </div>

                {/* Channel Meta */}
                <div className="flex-1 px-4 flex items-center gap-3 min-w-0">
                  <img
                    src={channel.thumbnailUrl}
                    alt={channel.name}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        onClick={() => onSelectChannel(channel.name)}
                        className="text-sm font-bold text-white truncate hover:text-spark-gold cursor-pointer transition-colors"
                        title={channel.name}
                      >
                        {channel.name}
                      </h4>
                      {channel.platform === 'tiktok' ? (
                        <span className="p-1 rounded bg-black/60 text-cyan-300 border border-cyan-400/20">
                          <TikTokIcon className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <span className="p-1 rounded bg-red-600/20 text-red-400 border border-red-500/20">
                          <YoutubeIcon className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-night-900 text-slate-300 border border-white/5 truncate max-w-[140px] sm:max-w-none">
                        {channel.mainCategory}
                      </span>
                      <span className="sm:hidden text-spark-gold font-semibold text-[11px]">
                        PV: {formatNumber(channel.totalViews)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Views */}
                <div className="w-28 text-right hidden sm:block">
                  <div className="text-sm font-bold text-spark-gold">
                    {formatNumber(channel.totalViews)}
                    <span className="text-[11px] font-normal text-slate-400 ml-1">回</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    平均: {formatNumber(channel.averageViews)}回
                  </div>
                </div>

                {/* Total Comments */}
                <div className="w-24 text-right hidden md:block">
                  <div className="text-sm font-bold text-slate-200">
                    {channel.totalComments.toLocaleString()}
                    <span className="text-[11px] font-normal text-slate-400 ml-1">件</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    総コメント数
                  </div>
                </div>

                {/* Video Count */}
                <div className="w-20 text-center hidden lg:block">
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-night-900 border border-white/5 text-slate-300">
                    {channel.videoCount}本
                  </span>
                </div>

                {/* Actions */}
                <div className="w-28 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onSelectChannel(channel.name)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-spark-coral/15 hover:bg-spark-coral/25 text-spark-coral border border-spark-coral/30 transition-all"
                  >
                    動画表示
                  </button>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-night-800 hover:bg-night-700 text-slate-400 hover:text-white transition-all"
                    title="チャンネル公式ページを開く"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
