import React from 'react';
import { Sparkles, Search, PlusCircle, HelpCircle, Flame, Bookmark, Trophy } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  onGoHome?: () => void;
  onGoRanking?: () => void;
  currentView?: 'videos' | 'ranking';
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenGuideModal,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
  onGoHome,
  onGoRanking,
  currentView = 'videos',
}) => {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/10 bg-night-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div 
              onClick={onGoHome}
              className="flex items-center gap-3 cursor-pointer group"
              title="ホームへ戻る"
            >
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-spark-coral via-spark-purple to-spark-gold p-0.5 shadow-lg shadow-spark-coral/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-night-900 rounded-[14px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-spark-gold animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                    HANABI <span className="bg-gradient-to-r from-spark-coral via-spark-gold to-spark-cyan bg-clip-text text-transparent">ARCHIVE</span>
                  </h1>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-spark-coral/20 text-spark-coral border border-spark-coral/30">
                    Auto-Sync
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  YouTube & TikTok 花火動画まとめ・自動更新システム
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              {onGoRanking && (
                <button
                  onClick={onGoRanking}
                  className={`p-2 rounded-xl border transition-all ${
                    currentView === 'ranking'
                      ? 'bg-spark-gold/20 border-spark-gold text-spark-gold'
                      : 'bg-night-900/60 border-white/10 text-spark-gold'
                  }`}
                  title="ランキング"
                >
                  <Trophy className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onToggleFavorites}
                className={`p-2 rounded-xl border transition-all ${
                  showFavoritesOnly
                    ? 'bg-spark-coral/20 border-spark-coral text-spark-coral'
                    : 'bg-night-900/60 border-white/10 text-slate-300'
                }`}
                title="お気に入り"
              >
                <Bookmark className="w-5 h-5 fill-current" />
              </button>
              <button
                onClick={onOpenGuideModal}
                className="p-2 rounded-xl bg-night-900/60 border border-white/10 text-slate-300"
                title="自動更新ガイド"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="大会名、4K、フェニックス、チャンネル名で検索..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-night-900/80 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spark-coral/50 focus:border-spark-coral/60 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-full px-1.5 py-0.5"
              >
                クリア
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {onGoRanking && (
              <button
                onClick={onGoRanking}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                  currentView === 'ranking'
                    ? 'bg-spark-gold text-night-950 border-spark-gold shadow-md shadow-spark-gold/30'
                    : 'bg-night-900/80 border-spark-gold/30 text-spark-gold hover:bg-spark-gold/10'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                ランキング
              </button>
            )}

            <button
              onClick={onToggleFavorites}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                showFavoritesOnly
                  ? 'bg-spark-coral/20 border-spark-coral text-spark-coral shadow-lg shadow-spark-coral/20'
                  : 'bg-night-900/80 border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              お気に入り {favoritesCount > 0 && `(${favoritesCount})`}
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-night-900/80 border border-white/10 text-slate-300 hover:border-white/25 hover:text-white transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-spark-cyan" />
              ソース追加
            </button>

            <button
              onClick={onOpenGuideModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-spark-coral to-spark-purple text-white shadow-md shadow-spark-coral/25 hover:opacity-95 transition-all"
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
