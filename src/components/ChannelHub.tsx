import React, { useState, useMemo } from 'react';
import type { ChannelStats } from '../types';
import { 
  Trophy, Eye, MessageSquare, Video, ExternalLink, Flame, 
  ArrowUpRight, LayoutGrid, Table, SlidersHorizontal, 
  Sparkles, TrendingUp, Play, RotateCcw
} from 'lucide-react';
import { YoutubeIcon, TikTokIcon } from './Icons';

interface ChannelHubProps {
  channels: ChannelStats[];
  onSelectChannel: (channel: ChannelStats) => void;
  onPlayVideoById: (videoId: string) => void;
  searchQuery: string;
}

export const ChannelHub: React.FC<ChannelHubProps> = ({
  channels,
  onSelectChannel,
  onPlayVideoById,
  searchQuery,
}) => {
  const [rankingMetric, setRankingMetric] = useState<'views' | 'comments' | 'average' | 'videos' | 'engagement'>('views');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'youtube' | 'tiktok'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'official' | 'creator' | 'tiktoker'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const formatNumber = (num?: number): string => {
    if (!num) return '0';
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}億`;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    return num.toLocaleString();
  };

  // 全カテゴリを抽出
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    channels.forEach(c => {
      if (c.mainCategory) set.add(c.mainCategory);
    });
    return Array.from(set);
  }, [channels]);

  // 最大PV（プログレスバー計算用）
  const maxViews = useMemo(() => {
    return Math.max(...channels.map(c => c.totalViews), 1);
  }, [channels]);

  // フィルタ＆ソート
  const filteredChannels = useMemo(() => {
    let list = [...channels];

    // プラットフォーム絞り込み
    if (platformFilter !== 'all') {
      list = list.filter(c => c.platform === platformFilter);
    }

    // 種別絞り込み
    if (typeFilter !== 'all') {
      list = list.filter(c => c.channelType === typeFilter);
    }

    // カテゴリ絞り込み
    if (selectedCategory !== 'all') {
      list = list.filter(c => c.mainCategory === selectedCategory);
    }

    // 検索語
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.mainCategory.toLowerCase().includes(q)
      );
    }

    // ソート
    if (rankingMetric === 'views') {
      list.sort((a, b) => b.totalViews - a.totalViews);
    } else if (rankingMetric === 'comments') {
      list.sort((a, b) => b.totalComments - a.totalComments);
    } else if (rankingMetric === 'average') {
      list.sort((a, b) => b.averageViews - a.averageViews);
    } else if (rankingMetric === 'videos') {
      list.sort((a, b) => b.videoCount - a.videoCount);
    } else if (rankingMetric === 'engagement') {
      list.sort((a, b) => (b.engagementRate || 0) - (a.engagementRate || 0));
    }

    return list;
  }, [channels, rankingMetric, platformFilter, typeFilter, selectedCategory, searchQuery]);

  const hasActiveFilters = platformFilter !== 'all' || typeFilter !== 'all' || selectedCategory !== 'all' || searchQuery !== '';

  const handleResetFilters = () => {
    setPlatformFilter('all');
    setTypeFilter('all');
    setSelectedCategory('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 pb-12">
      
      {/* Top 3 Podium Cards (PV順のデフォルト時に表示) */}
      {filteredChannels.length >= 3 && rankingMetric === 'views' && !hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-spark-gold flex items-center gap-1.5 uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-spark-gold" />
              殿堂入り チャンネル表彰台 (Top 3)
            </h3>
            <span className="text-xs text-slate-400">
              累計ページビュー（再生数）上位チャンネル
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            
            {/* 2nd Place */}
            <div className="glass-card rounded-2xl p-5 border border-slate-300/30 relative order-2 md:order-1 flex flex-col justify-between hover:border-slate-300/50 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-slate-300 text-night-950 flex items-center justify-center font-black text-sm shadow-md">
                    2
                  </span>
                  <span className="text-xs font-bold text-slate-300">第2位</span>
                </div>

                <div className="mt-4 text-center">
                  <img
                    src={filteredChannels[1].thumbnailUrl}
                    alt={filteredChannels[1].name}
                    className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-lg border border-white/10 mb-2.5"
                  />
                  <h4 className="font-bold text-white text-base truncate" title={filteredChannels[1].name}>
                    {filteredChannels[1].name}
                  </h4>
                  <div className="text-sm font-black text-spark-gold mt-1">
                    総PV: {formatNumber(filteredChannels[1].totalViews)}回
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    コメント: {filteredChannels[1].totalComments.toLocaleString()}件 / 動画 {filteredChannels[1].videoCount}本
                  </div>
                </div>

                {/* Top Video Preview */}
                {filteredChannels[1].topVideo && (
                  <div 
                    onClick={() => onPlayVideoById(filteredChannels[1].topVideo!.id)}
                    className="mt-4 p-2.5 rounded-xl bg-night-950/70 border border-white/5 hover:border-white/20 transition-all cursor-pointer group/top"
                  >
                    <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                      <Play className="w-3 h-3 text-spark-coral fill-current" />
                      最多PV代表作:
                    </div>
                    <div className="text-xs font-medium text-slate-200 line-clamp-1 group-hover/top:text-spark-gold transition-colors">
                      {filteredChannels[1].topVideo.title}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectChannel(filteredChannels[1])}
                className="mt-4 w-full py-2.5 text-xs font-bold rounded-xl bg-night-800 hover:bg-night-700 text-slate-200 border border-white/10 hover:border-white/25 transition-all flex items-center justify-center gap-1.5"
              >
                チャンネル詳細・動画一覧 ({filteredChannels[1].videoCount}本)
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* 1st Place (Gold Champion) */}
            <div className="glass-card rounded-2xl p-6 border-2 border-spark-gold/60 bg-gradient-to-b from-spark-gold/15 via-night-900/90 to-night-950 relative order-1 md:order-2 flex flex-col justify-between shadow-2xl shadow-spark-gold/15 -translate-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-spark-gold to-yellow-300 text-night-950 flex items-center justify-center font-black text-base shadow-xl shadow-spark-gold/50">
                    👑 1
                  </span>
                  <span className="text-xs font-black text-spark-gold flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-current text-spark-gold animate-bounce" />
                    第1位 チャンピオン
                  </span>
                </div>

                <div className="mt-3 text-center">
                  <img
                    src={filteredChannels[0].thumbnailUrl}
                    alt={filteredChannels[0].name}
                    className="w-20 h-20 rounded-2xl object-cover mx-auto shadow-2xl border-2 border-spark-gold mb-2.5 ring-4 ring-spark-gold/20"
                  />
                  <h4 className="font-black text-white text-lg truncate" title={filteredChannels[0].name}>
                    {filteredChannels[0].name}
                  </h4>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-sm font-black text-spark-gold bg-spark-gold/20 px-3 py-0.5 rounded-full border border-spark-gold/40">
                      総PV: {formatNumber(filteredChannels[0].totalViews)}回
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1.5">
                    総コメント数: <strong className="text-white">{filteredChannels[0].totalComments.toLocaleString()}</strong> 件 / 動画 {filteredChannels[0].videoCount}本
                  </div>
                </div>

                {/* Top Video Preview */}
                {filteredChannels[0].topVideo && (
                  <div 
                    onClick={() => onPlayVideoById(filteredChannels[0].topVideo!.id)}
                    className="mt-4 p-3 rounded-xl bg-night-950/80 border border-spark-gold/30 hover:border-spark-gold transition-all cursor-pointer group/top"
                  >
                    <div className="text-[10px] text-spark-gold font-bold mb-1 flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current text-spark-coral" />
                      最多PV代表作 (593万回):
                    </div>
                    <div className="text-xs font-semibold text-slate-100 line-clamp-1 group-hover/top:text-spark-gold transition-colors">
                      {filteredChannels[0].topVideo.title}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectChannel(filteredChannels[0])}
                className="mt-4 w-full py-3 text-xs font-black rounded-xl bg-gradient-to-r from-spark-gold via-spark-coral to-spark-gold text-night-950 shadow-xl shadow-spark-gold/25 hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
              >
                1位のチャンネル詳細・動画を見る
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3rd Place */}
            <div className="glass-card rounded-2xl p-5 border border-amber-600/30 relative order-3 flex flex-col justify-between hover:border-amber-600/50 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                    3
                  </span>
                  <span className="text-xs font-bold text-amber-500">第3位</span>
                </div>

                <div className="mt-4 text-center">
                  <img
                    src={filteredChannels[2].thumbnailUrl}
                    alt={filteredChannels[2].name}
                    className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-lg border border-white/10 mb-2.5"
                  />
                  <h4 className="font-bold text-white text-base truncate" title={filteredChannels[2].name}>
                    {filteredChannels[2].name}
                  </h4>
                  <div className="text-sm font-black text-spark-gold mt-1">
                    総PV: {formatNumber(filteredChannels[2].totalViews)}回
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    コメント: {filteredChannels[2].totalComments.toLocaleString()}件 / 動画 {filteredChannels[2].videoCount}本
                  </div>
                </div>

                {/* Top Video Preview */}
                {filteredChannels[2].topVideo && (
                  <div 
                    onClick={() => onPlayVideoById(filteredChannels[2].topVideo!.id)}
                    className="mt-4 p-2.5 rounded-xl bg-night-950/70 border border-white/5 hover:border-white/20 transition-all cursor-pointer group/top"
                  >
                    <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                      <Play className="w-3 h-3 text-spark-coral fill-current" />
                      最多PV代表作:
                    </div>
                    <div className="text-xs font-medium text-slate-200 line-clamp-1 group-hover/top:text-spark-gold transition-colors">
                      {filteredChannels[2].topVideo.title}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectChannel(filteredChannels[2])}
                className="mt-4 w-full py-2.5 text-xs font-semibold rounded-xl bg-night-800 hover:bg-night-700 text-slate-200 border border-white/10 hover:border-white/25 transition-all flex items-center justify-center gap-1.5"
              >
                チャンネル詳細・動画一覧 ({filteredChannels[2].videoCount}本)
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Control Filter Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4">
        
        {/* Row 1: Metric Sorting & View Mode */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Metrics */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-spark-gold" />
              集計指標:
            </span>
            <button
              onClick={() => setRankingMetric('views')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                rankingMetric === 'views'
                  ? 'bg-spark-gold text-night-950 shadow-md font-bold'
                  : 'bg-night-950/80 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              総再生数 (PV) 順
            </button>
            <button
              onClick={() => setRankingMetric('comments')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                rankingMetric === 'comments'
                  ? 'bg-spark-coral text-white shadow-md font-bold'
                  : 'bg-night-950/80 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              総コメント数順
            </button>
            <button
              onClick={() => setRankingMetric('average')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                rankingMetric === 'average'
                  ? 'bg-spark-cyan text-night-950 shadow-md font-bold'
                  : 'bg-night-950/80 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              平均PV順
            </button>
            <button
              onClick={() => setRankingMetric('videos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                rankingMetric === 'videos'
                  ? 'bg-spark-purple text-white shadow-md font-bold'
                  : 'bg-night-950/80 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              動画本数順
            </button>
            <button
              onClick={() => setRankingMetric('engagement')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                rankingMetric === 'engagement'
                  ? 'bg-pink-600 text-white shadow-md font-bold'
                  : 'bg-night-950/80 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              エンゲージメント順
            </button>
          </div>

          {/* View Mode & Reset */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            <span className="text-xs text-slate-400">
              該当 <strong className="text-white font-bold">{filteredChannels.length}</strong> チャンネル
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-spark-coral hover:text-spark-coral/80 bg-spark-coral/10 rounded-lg transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                リセット
              </button>
            )}

            <div className="flex items-center gap-1 p-1 rounded-xl bg-night-950 border border-white/10">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'cards' ? 'bg-night-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="カード表示"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-night-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="テーブル表示"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Row 2: Secondary Filters (Platform, Type, Category) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          {/* Platform Toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-night-950 border border-white/10">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                platformFilter === 'all' ? 'bg-night-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              全プラットフォーム
            </button>
            <button
              onClick={() => setPlatformFilter('youtube')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                platformFilter === 'youtube' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <YoutubeIcon className="w-3 h-3" />
              YouTube
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                platformFilter === 'tiktok' ? 'bg-cyan-500 text-night-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TikTokIcon className="w-3 h-3" />
              TikTok
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-night-950 border border-white/10">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                typeFilter === 'all' ? 'bg-night-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              全種別
            </button>
            <button
              onClick={() => setTypeFilter('official')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                typeFilter === 'official' ? 'bg-spark-gold/20 text-spark-gold font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              大会公式組織
            </button>
            <button
              onClick={() => setTypeFilter('creator')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                typeFilter === 'creator' ? 'bg-spark-coral/20 text-spark-coral font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              映像クリエイター
            </button>
            <button
              onClick={() => setTypeFilter('tiktoker')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                typeFilter === 'tiktoker' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              TikToker
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-night-950 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">全大会・全地域</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Content Area: Cards or Table */}
      {filteredChannels.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
          <div className="text-3xl">🔍</div>
          <h4 className="text-base font-bold text-white">該当するチャンネルが見つかりませんでした</h4>
          <p className="text-xs text-slate-400">検索語やフィルタ条件を変更してお試しください。</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-spark-coral text-white"
          >
            条件をリセット
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        
        /* 🎴 Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChannels.map((channel, index) => {
            const rank = index + 1;
            const progressPercent = Math.min(100, Math.max(5, (channel.totalViews / maxViews) * 100));

            return (
              <div
                key={channel.id}
                className="group glass-card rounded-2xl p-5 border border-white/10 hover:border-spark-coral/40 transition-all flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-spark-coral/10"
              >
                <div>
                  {/* Card Header: Rank, Icon, Name */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={channel.thumbnailUrl}
                        alt={channel.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -top-2 -left-2">
                        {rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-spark-gold text-night-950 font-black text-xs flex items-center justify-center shadow-lg">1</span>
                        ) : rank === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-night-950 font-black text-xs flex items-center justify-center shadow-md">2</span>
                        ) : rank === 3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-md">3</span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-night-900 border border-white/20 text-slate-400 font-bold text-xs flex items-center justify-center">{rank}</span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {channel.platform === 'tiktok' ? (
                          <span className="p-1 rounded bg-black/60 text-cyan-300 border border-cyan-400/20">
                            <TikTokIcon className="w-2.5 h-2.5" />
                          </span>
                        ) : (
                          <span className="p-1 rounded bg-red-600/20 text-red-400 border border-red-500/20">
                            <YoutubeIcon className="w-2.5 h-2.5" />
                          </span>
                        )}

                        {channel.channelType === 'official' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-spark-gold/15 text-spark-gold font-bold border border-spark-gold/30">
                            公式
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-night-950 border border-white/5 truncate max-w-[120px]">
                          {channel.mainCategory}
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectChannel(channel)}
                        className="text-base font-bold text-white truncate hover:text-spark-gold cursor-pointer transition-colors mt-1"
                        title={channel.name}
                      >
                        {channel.name}
                      </h4>
                    </div>
                  </div>

                  {/* Primary Stats: PV & Comments */}
                  <div className="mt-4 p-3 rounded-xl bg-night-950/80 border border-white/5 space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400 flex items-center gap-1 font-medium">
                          <Eye className="w-3.5 h-3.5 text-spark-gold" />
                          総再生数 (PV)
                        </span>
                        <span className="text-spark-gold font-black text-sm">
                          {formatNumber(channel.totalViews)} <span className="text-xs font-normal text-slate-400">回</span>
                        </span>
                      </div>
                      {/* PV Progress Bar */}
                      <div className="w-full h-1.5 bg-night-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-spark-gold to-spark-coral rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">総コメント</div>
                        <div className="font-bold text-slate-200 mt-0.5">
                          {channel.totalComments.toLocaleString()}件
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">平均PV</div>
                        <div className="font-bold text-slate-200 mt-0.5">
                          {formatNumber(channel.averageViews)}回
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">登録動画</div>
                        <div className="font-bold text-white mt-0.5">
                          {channel.videoCount}本
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Video Snippet */}
                  {channel.topVideo && (
                    <div
                      onClick={() => onPlayVideoById(channel.topVideo!.id)}
                      className="mt-3 p-2 rounded-xl bg-night-950/40 border border-white/5 hover:border-spark-coral/30 cursor-pointer transition-all flex items-center gap-2 group/v"
                    >
                      <img
                        src={channel.topVideo.thumbnailUrl}
                        alt=""
                        className="w-10 h-7 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-slate-400 font-medium truncate">
                          最多PV: <span className="text-slate-200 group-hover/v:text-spark-gold">{channel.topVideo.title}</span>
                        </div>
                      </div>
                      <Play className="w-3.5 h-3.5 text-spark-coral shrink-0 group-hover/v:scale-110 transition-transform" />
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                  <button
                    onClick={() => onSelectChannel(channel)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-spark-coral to-spark-purple text-white shadow-md shadow-spark-coral/15 hover:opacity-95 transition-all flex items-center justify-center gap-1"
                  >
                    チャンネル詳細・動画一覧 ({channel.videoCount}本)
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-night-900 hover:bg-night-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
                    title="公式チャンネルを開く"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      ) : (

        /* 📋 Table View */
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-night-950/80 text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 text-center w-14">順位</th>
                  <th className="py-3 px-4">チャンネル</th>
                  <th className="py-3 px-4">プラットフォーム</th>
                  <th className="py-3 px-4 text-right">総再生数 (PV)</th>
                  <th className="py-3 px-4 text-right">総コメント数</th>
                  <th className="py-3 px-4 text-right">平均PV</th>
                  <th className="py-3 px-4 text-center">動画数</th>
                  <th className="py-3 px-4 text-right">エンゲージメント</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredChannels.map((channel, index) => {
                  const rank = index + 1;
                  return (
                    <tr 
                      key={channel.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold">
                        {rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-spark-gold text-night-950 font-black inline-flex items-center justify-center">1</span>
                        ) : rank === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-night-950 font-black inline-flex items-center justify-center">2</span>
                        ) : rank === 3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black inline-flex items-center justify-center">3</span>
                        ) : (
                          <span className="text-slate-500 font-semibold">{rank}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={channel.thumbnailUrl}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <span 
                              onClick={() => onSelectChannel(channel)}
                              className="font-bold text-white hover:text-spark-gold cursor-pointer transition-colors block truncate max-w-[200px]"
                            >
                              {channel.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                              {channel.mainCategory}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {channel.platform === 'tiktok' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-black/60 px-2 py-0.5 rounded-full border border-cyan-400/20">
                            <TikTokIcon className="w-2.5 h-2.5" />
                            TikTok
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-red-600/80 px-2 py-0.5 rounded-full">
                            <YoutubeIcon className="w-2.5 h-2.5" />
                            YouTube
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-black text-spark-gold">
                        {formatNumber(channel.totalViews)}回
                      </td>

                      <td className="py-3 px-4 text-right font-semibold text-slate-200">
                        {channel.totalComments.toLocaleString()}件
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-slate-300">
                        {formatNumber(channel.averageViews)}回
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-white">
                        {channel.videoCount}本
                      </td>

                      <td className="py-3 px-4 text-right text-spark-purple font-bold">
                        {channel.engagementRate ? `${channel.engagementRate}%` : '-'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectChannel(channel)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-spark-coral/15 text-spark-coral hover:bg-spark-coral/25 border border-spark-coral/30"
                          >
                            詳細
                          </button>
                          <a
                            href={channel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg bg-night-900 text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  );
};
