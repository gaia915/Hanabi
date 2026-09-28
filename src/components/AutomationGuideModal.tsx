import React from 'react';
import { X, Sparkles, Terminal, Clock, GitBranch, CheckCircle2 } from 'lucide-react';

interface AutomationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomationGuideModal: React.FC<AutomationGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-night-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-spark-coral to-spark-purple text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                最新情報の自動更新システムについて
              </h3>
              <p className="text-xs text-slate-400">
                YouTube RSS・検索・TikTok・Instagram による完全自動巡回
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-night-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Mechanism */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-spark-gold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            1. 動画収集の仕組み
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-night-950 border border-white/5 space-y-1">
              <span className="font-bold text-red-400 block">YouTube公式RSS</span>
              <p className="text-slate-400 text-[11px]">
                APIキー不要・制限なし。長岡花火公式などの最新動画（15件）を確実に取得。
              </p>
            </div>
            <div className="p-3 rounded-xl bg-night-950 border border-white/5 space-y-1">
              <span className="font-bold text-spark-purple block">yt-dlp 花火検索</span>
              <p className="text-slate-400 text-[11px]">
                「花火大会 4K」「大曲の花火」など最新の話題動画・高画質動画を自動検索・集約。
              </p>
            </div>
            <div className="p-3 rounded-xl bg-night-950 border border-white/5 space-y-1">
              <span className="font-bold text-cyan-400 block">TikTok oEmbed</span>
              <p className="text-slate-400 text-[11px]">
                TikTok公式API連携で、タイトル・作者・サムネイル・埋め込み情報を即時取得。
              </p>
            </div>
            <div className="p-3 rounded-xl bg-night-950 border border-white/5 space-y-1">
              <span className="font-bold text-pink-400 block">Instagram Reels</span>
              <p className="text-slate-400 text-[11px]">
                Meta公式埋め込みシステムにより、認証不要でリール動画を完全再生。
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: GitHub Actions Automated Cron */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-spark-cyan flex items-center gap-2">
            <Clock className="w-4 h-4" />
            2. GitHub Actions による完全自動化 (無料・サーバー代0円)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            リポジトリ内の <code>.github/workflows/auto_update.yml</code> により、
            <strong>毎日自動（Cronスケジュール）</strong> でPythonスクリプトが最新動画を巡回し、
            新しい花火動画があれば自動コミット＆GitHub Pages / Vercel へ自動デプロイされます。
          </p>
          <div className="p-3 rounded-xl bg-night-950 border border-white/10 text-xs font-mono text-slate-300 space-y-1">
            <div className="text-slate-500"># GitHub Actions 実行スケジュール例（毎日深夜0時・昼12時）</div>
            <div className="text-spark-gold">schedule:</div>
            <div className="pl-4 text-emerald-400">- cron: '0 0,12 * * *'</div>
          </div>
        </div>

        {/* Step 3: Local Manual Command */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-spark-coral flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            3. 手元（ローカル）ですぐに更新したい場合
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            ターミナルで以下のコマンドを実行するだけで、数秒で最新動画が反映されます：
          </p>
          <div className="p-3 rounded-xl bg-night-950 border border-white/10 text-xs font-mono text-slate-200">
            npm run update-data
          </div>
        </div>

        {/* Step 4: Add New Channels */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            4. チャンネル・動画の追加方法
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            右上の「<strong>ソース追加</strong>」ボタンから設定をコピーし、
            プロジェクト内の <code>data/sources.json</code> に追加して保存するだけです。
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-spark-coral to-spark-purple text-white font-semibold text-xs shadow-lg hover:opacity-95 transition-all"
          >
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
};
