import React from 'react';
import type { Platform } from '../types';
import { SlidersHorizontal, Sparkles, Play, RotateCcw } from 'lucide-react';
import { YoutubeIcon, TikTokIcon } from './Icons';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedPlatform: Platform | 'all';
  onSelectPlatform: (platform: Platform | 'all') => void;
  sortBy: 'latest' | 'oldest' | 'title' | 'views' | 'comments';
  onSelectSort: (sort: 'latest' | 'oldest' | 'title' | 'views' | 'comments') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  popularTags: string[];
  totalFilteredCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
  sortBy,
  onSelectSort,
  selectedTag,
  onSelectTag,
  popularTags,
  totalFilteredCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-4">
      
      {/* Platform & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        
        {/* Platform Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-night-900/90 border border-white/10 w-fit">
          <button
            onClick={() => onSelectPlatform('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedPlatform === 'all'
                ? 'bg-gradient-to-r from-spark-coral to-spark-purple text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => onSelectPlatform('youtube')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedPlatform === 'youtube'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <YoutubeIcon className="w-3.5 h-3.5" />
            YouTube
          </button>
          <button
            onClick={() => onSelectPlatform('youtube_shorts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedPlatform === 'youtube_shorts'
                ? 'bg-red-500/30 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            Shorts
          </button>
          <button
            onClick={() => onSelectPlatform('tiktok')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedPlatform === 'tiktok'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TikTokIcon className="w-3 h-3" />
            TikTok
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <span className="text-xs text-slate-400">
            該当 <strong className="text-white font-bold">{totalFilteredCount}</strong> 件
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value as any)}
              className="text-xs bg-night-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-spark-coral/50"
            >
              <option value="latest">新着順 (公開日)</option>
              <option value="views">🔥 再生回数 (PV) 順</option>
              <option value="comments">💬 コメント数順</option>
              <option value="oldest">古い順</option>
              <option value="title">タイトル順</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-spark-coral hover:text-spark-coral/80 bg-spark-coral/10 hover:bg-spark-coral/20 rounded-lg transition-all"
                title="フィルタをリセット"
              >
                <RotateCcw className="w-3 h-3" />
                リセット
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-spark-gold/20 text-spark-gold border-spark-gold/40 shadow-sm'
              : 'bg-night-900/60 text-slate-400 border-white/5 hover:text-white hover:border-white/20'
          }`}
        >
          全大会・全地域
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-spark-gold/20 text-spark-gold border-spark-gold/40 shadow-sm'
                : 'bg-night-900/60 text-slate-400 border-white/5 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tag Chips */}
      {popularTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-spark-coral" />
            タグ:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-0.5 text-[11px] rounded-md transition-all ${
                selectedTag === tag
                  ? 'bg-spark-coral text-white font-semibold shadow-sm'
                  : 'bg-night-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};
