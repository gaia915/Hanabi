import React, { useState } from 'react';
import { X, Plus, Copy, Check, Sparkles } from 'lucide-react';
import { YoutubeIcon, TikTokIcon, InstagramIcon } from './Icons';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<'yt_channel' | 'yt_query' | 'tiktok' | 'instagram'>('yt_channel');
  const [copied, setCopied] = useState(false);

  // YouTube Channel Form
  const [ytName, setYtName] = useState('');
  const [ytHandle, setYtHandle] = useState('@');
  const [ytCat, setYtCat] = useState(categories[0] || '長岡まつり大花火大会');
  const [ytRegion, setYtRegion] = useState('全国');

  // YouTube Search Query Form
  const [queryText, setQueryText] = useState('土浦花火 4K');
  const [queryCat, setQueryCat] = useState(categories[3] || '土浦全国花火競技大会');
  const [queryLimit, setQueryLimit] = useState(5);

  // TikTok Form
  const [ttUrl, setTtUrl] = useState('');
  const [ttTitle, setTtTitle] = useState('');
  const [ttAuthor, setTtAuthor] = useState('');
  const [ttCat, setTtCat] = useState(categories[0] || '長岡まつり大花火大会');

  // Instagram Form
  const [igUrl, setIgUrl] = useState('');
  const [igTitle, setIgTitle] = useState('');
  const [igAuthor, setIgAuthor] = useState('');
  const [igCat, setIgCat] = useState(categories[0] || '熱海海上花火大会');
  const [igRegion, setIgRegion] = useState('静岡県');

  if (!isOpen) return null;

  const generateSnippet = () => {
    if (activeTab === 'yt_channel') {
      return JSON.stringify({
        name: ytName || "花火チャンネル",
        handle: ytHandle.startsWith('@') ? ytHandle : `@${ytHandle}`,
        default_category: ytCat,
        default_region: ytRegion
      }, null, 2);
    } else if (activeTab === 'yt_query') {
      return JSON.stringify({
        query: queryText,
        default_category: queryCat,
        max_results: Number(queryLimit)
      }, null, 2);
    } else if (activeTab === 'tiktok') {
      return JSON.stringify({
        url: ttUrl || "https://www.tiktok.com/@user/video/...",
        title: ttTitle || "花火の動画",
        author_name: ttAuthor || "クリエイター名",
        category: ttCat,
        region: "日本"
      }, null, 2);
    } else {
      return JSON.stringify({
        url: igUrl || "https://www.instagram.com/reel/...",
        title: igTitle || "花火リール動画",
        author_name: igAuthor || "@creator_name",
        category: igCat,
        region: igRegion,
        view_count: 50000,
        comment_count: 120
      }, null, 2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-night-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-spark-cyan/20 text-spark-cyan">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                収集ソース（動画・チャンネル）の追加
              </h3>
              <p className="text-xs text-slate-400">
                data/sources.json に追記する設定スニペットを生成します
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-night-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-night-950 p-1 border border-white/5 gap-1">
          <button
            onClick={() => setActiveTab('yt_channel')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'yt_channel'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <YoutubeIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">YouTube</span>チャンネル
          </button>
          <button
            onClick={() => setActiveTab('yt_query')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'yt_query'
                ? 'bg-spark-purple text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">YouTube</span>検索
          </button>
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'tiktok'
                ? 'bg-cyan-500 text-night-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TikTokIcon className="w-3.5 h-3.5" />
            TikTok
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'instagram'
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            Instagram
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-3.5">
          {activeTab === 'yt_channel' && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">チャンネル名（表示名）</label>
                <input
                  type="text"
                  value={ytName}
                  onChange={(e) => setYtName(e.target.value)}
                  placeholder="例: 神宮外苑花火公式"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-spark-coral"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">YouTubeハンドル または チャンネルURL</label>
                <input
                  type="text"
                  value={ytHandle}
                  onChange={(e) => setYtHandle(e.target.value)}
                  placeholder="例: @jinguhanabi"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-spark-coral"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">対象大会</label>
                  <select
                    value={ytCat}
                    onChange={(e) => setYtCat(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">地域</label>
                  <input
                    type="text"
                    value={ytRegion}
                    onChange={(e) => setYtRegion(e.target.value)}
                    placeholder="例: 東京都"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'yt_query' && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">検索キーワード (4K、大会名など)</label>
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="例: 土浦全国花火競技大会 10号玉 4K"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-spark-purple"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">自動分類先大会</label>
                  <select
                    value={queryCat}
                    onChange={(e) => setQueryCat(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">最大取得件数</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={queryLimit}
                    onChange={(e) => setQueryLimit(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'tiktok' && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">TikTok動画URL</label>
                <input
                  type="text"
                  value={ttUrl}
                  onChange={(e) => setTtUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@user/video/..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">タイトル（任意・oEmbed取得失敗時の予備）</label>
                <input
                  type="text"
                  value={ttTitle}
                  onChange={(e) => setTtTitle(e.target.value)}
                  placeholder="例: 大迫力のスターマイン！"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">大会名</label>
                  <select
                    value={ttCat}
                    onChange={(e) => setTtCat(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">投稿者名（任意）</label>
                  <input
                    type="text"
                    value={ttAuthor}
                    onChange={(e) => setTtAuthor(e.target.value)}
                    placeholder="例: 花火クリエイター"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'instagram' && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Instagramリール / 投稿URL</label>
                <input
                  type="text"
                  value={igUrl}
                  onChange={(e) => setIgUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/C-..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">動画タイトル・見出し</label>
                <input
                  type="text"
                  value={igTitle}
                  onChange={(e) => setIgTitle(e.target.value)}
                  placeholder="例: 熱海海上花火大会2024 大空中ナイアガラ"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">アカウント名・投稿者</label>
                <input
                  type="text"
                  value={igAuthor}
                  onChange={(e) => setIgAuthor(e.target.value)}
                  placeholder="例: @atami_hanabi"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">対象大会</label>
                  <select
                    value={igCat}
                    onChange={(e) => setIgCat(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">地域</label>
                  <input
                    type="text"
                    value={igRegion}
                    onChange={(e) => setIgRegion(e.target.value)}
                    placeholder="例: 静岡県"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Generated JSON preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>生成された設定 (data/sources.json に追加)</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-spark-cyan hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'コピー完了！' : 'JSONをコピー'}
            </button>
          </div>
          <pre className="text-[11px] p-3 rounded-xl bg-night-950 text-slate-300 font-mono overflow-x-auto border border-white/10 max-h-32">
            {generateSnippet()}
          </pre>
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-slate-400">
          💡 コピーした内容を <code>data/sources.json</code> の該当セクションに追加して <code>python scripts/update_videos.py</code> を実行（またはGitHubにプッシュ）するだけで、自動的にサイトに反映されます。
        </p>

      </div>
    </div>
  );
};
