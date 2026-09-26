import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { VideoCard } from './components/VideoCard';
import { VideoModal } from './components/VideoModal';
import { AddSourceModal } from './components/AddSourceModal';
import { AutomationGuideModal } from './components/AutomationGuideModal';
import type { HanabiVideo, Platform, AggregatorStats } from './types';

// 静的JSONデータのインポート
import initialVideos from './data/videos.json';
import initialStats from './data/stats.json';

const FAVORITES_KEY = 'hanabi_archive_favorites';

export const App: React.FC = () => {
  const [videos] = useState<HanabiVideo[]>(initialVideos as HanabiVideo[]);
  const [stats] = useState<AggregatorStats | null>(initialStats as AggregatorStats);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title'>('latest');

  // Favorites (LocalStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals
  const [activeVideo, setActiveVideo] = useState<HanabiVideo | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    videos.forEach(v => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set);
  }, [videos]);

  // Extract popular tags
  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach(v => {
      v.tags.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }, [videos]);

  // Filter & Sort Logic
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(video.id)) {
        return false;
      }

      // Platform filter
      if (selectedPlatform !== 'all') {
        if (selectedPlatform === 'youtube') {
          if (video.platform !== 'youtube') return false;
        } else if (selectedPlatform === 'youtube_shorts') {
          if (video.platform !== 'youtube_shorts') return false;
        } else if (selectedPlatform === 'tiktok') {
          if (video.platform !== 'tiktok') return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && video.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && !video.tags.includes(selectedTag)) {
        return false;
      }

      // Search text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = video.title.toLowerCase().includes(q);
        const inAuthor = video.authorName.toLowerCase().includes(q);
        const inCategory = video.category.toLowerCase().includes(q);
        const inTags = video.tags.some(t => t.toLowerCase().includes(q));
        const inDesc = video.description.toLowerCase().includes(q);

        if (!inTitle && !inAuthor && !inCategory && !inTags && !inDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ja');
      }
      const timeA = new Date(a.publishedAt).getTime();
      const timeB = new Date(b.publishedAt).getTime();
      if (sortBy === 'oldest') {
        return timeA - timeB;
      }
      return timeB - timeA; // latest
    });
  }, [videos, searchQuery, selectedCategory, selectedPlatform, selectedTag, sortBy, favorites, showFavoritesOnly]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedPlatform !== 'all' || selectedTag !== null || showFavoritesOnly;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
    setSelectedTag(null);
    setShowFavoritesOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-spark-coral selection:text-white">
      
      {/* Background Ambience Sparks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 rounded-full bg-spark-gold opacity-60 animate-twinkle" />
        <div className="absolute top-[25%] right-[20%] w-2 h-2 rounded-full bg-spark-coral opacity-50 animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[60%] left-[8%] w-1 h-1 rounded-full bg-spark-cyan opacity-40 animate-twinkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[80%] right-[10%] w-1.5 h-1.5 rounded-full bg-spark-purple opacity-50 animate-twinkle" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(prev => !prev)}
        favoritesCount={favorites.length}
      />

      <main className="flex-1 relative z-10 pb-16">
        
        {/* Aggregator Overview Banner */}
        <StatsBanner
          stats={stats}
          onRefreshClick={() => setIsGuideModalOpen(true)}
        />

        {/* Filter Controls */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          popularTags={popularTags}
          totalFilteredCount={filteredVideos.length}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Video Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {filteredVideos.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-night-900 border border-white/10 flex items-center justify-center text-slate-400">
                🔍
              </div>
              <h3 className="text-base font-bold text-white">該当する花火動画が見つかりませんでした</h3>
              <p className="text-xs text-slate-400">
                検索キーワードやフィルタ条件を変更してお試しください。
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-spark-coral text-white shadow-lg hover:opacity-95 transition-all"
              >
                すべての動画を表示する
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={setActiveVideo}
                  isFavorite={favorites.includes(video.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/10 py-8 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-bold text-slate-200">HANABI ARCHIVE</span> - 花火動画キュレーション・自動更新システム
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              自動更新の仕組み
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              ソース設定
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub Actions Cron
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        isFavorite={activeVideo ? favorites.includes(activeVideo.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <AddSourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
      />

      <AutomationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

    </div>
  );
};

export default App;
