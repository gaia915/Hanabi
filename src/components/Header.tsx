import React from 'react';
import { Sparkles, Search, PlusCircle, HelpCircle, Flame, Bookmark, Trophy, Film } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  currentView: 'channels' | 'videos';
  onViewChange: (view: 'channels' | 'videos') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenGuideModal,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
  currentView,
  onViewChange,
}) => {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/10 bg-night-950/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3.5">
          
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            {/* Logo */}
            <div 
              onClick={() => onViewChange('channels')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
              title="チャンネル集計トップへ"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-spark-gold via-spark-coral to-spark-purple p-0.5 shadow-lg shadow-spark-coral/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-night-900 rounded-[14px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-spark-gold animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
                    HANABI <span className="bg-gradient-to-r from-spark-gold via-spark-coral to-spark-cyan bg-clip-text text-transparent">INSIGHTS</span>
                  </h1>
                  <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-spark-gold/20 text-spark-gold border border-spark-gold/30">
                    Channel Analytics
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  花火チャンネル総PV・コメント集計ポータル
                </p>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => onViewChange('channels')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                  currentView === 'channels'
                    ? 'bg-spark-gold text-night-950 border-spark-gold'
                    : 'bg-night-900 text-slate-300 border-white/10'
                }`}
                title="チャンネル集計"
              >
                <Trophy className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewChange('videos')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                  currentView === 'videos'
                    ? 'bg-spark-coral text-white border-spark-coral'
                    : 'bg-night-900 text-slate-300 border-white/10'
                }`}
                title="花火動画一覧"
              >
                <Film className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenGuideModal}
                className="p-2 rounded-xl bg-night-900 text-slate-400 border border-white/10"
                title="自動更新ガイド"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-night-900/90 border border-white/10 shadow-inner">
            <button
              onClick={() => onViewChange('channels')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'channels'
                  ? 'bg-gradient-to-r from-spark-gold to-spark-coral text-night-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              🏆 チャンネル集計＆ランキング
            </button>
            <button
              onClick={() => onViewChange('videos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'videos'
                  ? 'bg-gradient-to-r from-spark-coral to-spark-purple text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              🎬 花火動画アーカイブ
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="チャンネル名・大会名・タグで検索..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-night-900/90 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-spark-coral/60 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white bg-slate-800 rounded-full px-1.5 py-0.5"
              >
                クリア
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onToggleFavorites}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                showFavoritesOnly
                  ? 'bg-spark-coral/20 border-spark-coral text-spark-coral shadow-sm'
                  : 'bg-night-900/80 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              保存 {favoritesCount > 0 && `(${favoritesCount})`}
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-night-900/80 border border-white/10 text-slate-300 hover:text-white transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-spark-cyan" />
              ソース追加
            </button>

            <button
              onClick={onOpenGuideModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-spark-coral to-spark-purple text-white shadow-sm hover:opacity-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              自動更新
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
