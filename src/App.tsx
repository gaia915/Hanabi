import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ChannelHero } from './components/ChannelHero';
import { ChannelHub } from './components/ChannelHub';
import { ChannelDetailModal } from './components/ChannelDetailModal';
import { FilterBar } from './components/FilterBar';
import { VideoCard } from './components/VideoCard';
import { VideoModal } from './components/VideoModal';
import { AddSourceModal } from './components/AddSourceModal';
import { AutomationGuideModal } from './components/AutomationGuideModal';
import type { HanabiVideo, Platform, AggregatorStats, ChannelStats } from './types';


// 静的JSONデータのインポート
import initialVideos from './data/videos.json';
import initialStats from './data/stats.json';
import initialChannels from './data/channels.json';

const FAVORITES_KEY = 'hanabi_archive_favorites';

export const App: React.FC = () => {
  const [videos] = useState<HanabiVideo[]>(initialVideos as HanabiVideo[]);
  const [stats] = useState<AggregatorStats | null>(initialStats as AggregatorStats);
  const [channels] = useState<ChannelStats[]>(initialChannels as ChannelStats[]);

  // Navigation tab ('channels' is primary!)
  const [currentView, setCurrentView] = useState<'channels' | 'videos'>('channels');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title' | 'views' | 'comments'>('views');

  // Channel focus for video list
  const [filterByChannelName, setFilterByChannelName] = useState<string | null>(null);

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

  // Active Modals
  const [selectedChannelDetail, setSelectedChannelDetail] = useState<ChannelStats | null>(null);
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

  // Top Ranked Channel (1st by PV)
  const topChannel = useMemo(() => {
    if (channels.length === 0) return null;
    return [...channels].sort((a, b) => b.totalViews - a.totalViews)[0];
  }, [channels]);

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

  // Play video by ID directly
  const handlePlayVideoById = (videoId: string) => {
    const found = videos.find(v => v.id === videoId);
    if (found) {
      setActiveVideo(found);
    }
  };

  // Open channel detail by channel name
  const handleOpenChannelByName = (channelName: string) => {
    const found = channels.find(c => c.name === channelName);
    if (found) {
      setSelectedChannelDetail(found);
    } else {
      setSearchQuery(channelName);
      setCurrentView('channels');
    }
  };

  // Filter & Sort Logic for Video Archive
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      // Channel specific filter
      if (filterByChannelName && video.authorName !== filterByChannelName) {
        return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(video.id)) {
        return false;
      }

      // Platform filter
      if (selectedPlatform !== 'all') {
        if (video.platform !== selectedPlatform) return false;
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
      if (sortBy === 'views') {
        return (b.viewCount || 0) - (a.viewCount || 0);
      }
      if (sortBy === 'comments') {
        return (b.commentCount || 0) - (a.commentCount || 0);
      }
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
  }, [videos, searchQuery, selectedCategory, selectedPlatform, selectedTag, sortBy, favorites, showFavoritesOnly, filterByChannelName]);

  const hasActiveVideoFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedPlatform !== 'all' || selectedTag !== null || showFavoritesOnly || filterByChannelName !== null;

  const handleResetVideoFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
    setSelectedTag(null);
    setShowFavoritesOnly(false);
    setFilterByChannelName(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-spark-coral selection:text-white">
      
      {/* Background Ambience Sparks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[8%] left-[12%] w-1.5 h-1.5 rounded-full bg-spark-gold opacity-60 animate-twinkle" />
        <div className="absolute top-[22%] right-[18%] w-2 h-2 rounded-full bg-spark-coral opacity-50 animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[55%] left-[6%] w-1.5 h-1.5 rounded-full bg-spark-cyan opacity-40 animate-twinkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[75%] right-[8%] w-2 h-2 rounded-full bg-spark-purple opacity-50 animate-twinkle" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => {
          setShowFavoritesOnly(prev => !prev);
          setCurrentView('videos');
        }}
        favoritesCount={favorites.length}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'channels') setFilterByChannelName(null);
        }}
      />

      <main className="flex-1 relative z-10 pb-16">
        
        {/* Hero Banner with Big Aggregation Stats */}
        <ChannelHero
          stats={stats}
          topChannel={topChannel}
          onSelectChannel={(ch) => setSelectedChannelDetail(ch)}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
        />

        {/* Dynamic Main View */}
        {currentView === 'channels' ? (
          /* 🏆 PRIMARY VIEW: CHANNEL RANKING & ANALYTICS */
          <ChannelHub
            channels={channels}
            onSelectChannel={(ch) => setSelectedChannelDetail(ch)}
            onPlayVideoById={handlePlayVideoById}
            searchQuery={searchQuery}
          />
        ) : (
          /* 🎬 SECONDARY VIEW: ALL FIREWORKS VIDEOS ARCHIVE */
          <div className="space-y-6">
            
            {/* Filter by Channel Active Banner */}
            {filterByChannelName && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-card rounded-2xl p-4 border border-spark-gold/40 bg-spark-gold/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-spark-gold" />
                    「{filterByChannelName}」の登録動画を表示中 ({filteredVideos.length}本)
                  </div>
                  <button
                    onClick={() => setFilterByChannelName(null)}
                    className="flex items-center gap-1 text-xs text-spark-gold hover:underline font-bold"
                  >
                    すべてのチャンネルに戻す
                  </button>
                </div>
              </div>
            )}

            {/* Filter Bar */}
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
              onResetFilters={handleResetVideoFilters}
              hasActiveFilters={hasActiveVideoFilters}
            />

            {/* Video Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              {filteredVideos.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8 space-y-4">
                  <div className="text-3xl">🔍</div>
                  <h3 className="text-base font-bold text-white">該当する花火動画が見つかりませんでした</h3>
                  <p className="text-xs text-slate-400">
                    検索キーワードやフィルタ条件を変更してお試しください。
                  </p>
                  <button
                    onClick={handleResetVideoFilters}
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
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/10 py-8 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-bold text-slate-200">HANABI CHANNEL INSIGHTS</span> - 花火チャンネル総PV・コメント集計ポータル
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('channels')}
              className={`hover:text-white transition-colors ${currentView === 'channels' ? 'text-spark-gold font-bold' : ''}`}
            >
              🏆 チャンネル集計
            </button>
            <button
              onClick={() => setCurrentView('videos')}
              className={`hover:text-white transition-colors ${currentView === 'videos' ? 'text-spark-coral font-bold' : ''}`}
            >
              🎬 動画一覧
            </button>
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
              href="https://github.com/gaia915/Hanabi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub リポジトリ
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChannelDetailModal
        channel={selectedChannelDetail}
        videos={videos}
        onClose={() => setSelectedChannelDetail(null)}
        onPlayVideo={(v) => setActiveVideo(v)}
      />

      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        isFavorite={activeVideo ? favorites.includes(activeVideo.id) : false}
        onToggleFavorite={toggleFavorite}
        onOpenChannel={handleOpenChannelByName}
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
