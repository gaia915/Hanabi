#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
花火動画 自動収集・最新情報更新スクリプト
YouTube RSS、YouTube検索(yt-dlp)、TikTok oEmbed APIから花火動画を収集・整理し、
Webサイト用のJSONデータベースを作成します。
"""

import os
import sys
import json
import re
import urllib.request
import urllib.parse
from datetime import datetime, timezone
import feedparser
import yt_dlp

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES_FILE = os.path.join(BASE_DIR, "data", "sources.json")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "videos.json")
SRC_OUTPUT_FILE = os.path.join(BASE_DIR, "src", "data", "videos.json")

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
}

CATEGORY_KEYWORDS = [
    ("長岡まつり大花火大会", ["長岡", "フェニックス", "正三尺玉", "信濃川"]),
    ("大曲の花火（全国花火競技大会）", ["大曲", "全国花火競技大会", "昼花火"]),
    ("隅田川花火大会", ["隅田川", "浅草", "スカイツリー花火"]),
    ("土浦全国花火競技大会", ["土浦", "桜川"]),
    ("神宮外苑花火大会", ["神宮外苑", "神宮花火"]),
    ("熱海海上花火大会", ["熱海", "海上花火"]),
    ("びわ湖大花火大会", ["びわ湖", "琵琶湖"]),
    ("赤川花火大会", ["赤川"]),
    ("熊野大花火大会", ["熊野", "鬼ヶ城"]),
    ("みなとこうべ海上花火大会", ["みなとこうべ", "神戸花火"]),
]

TAG_KEYWORDS = [
    "4K", "8K", "HDR", "フェニックス", "正三尺玉", "二尺玉", "尺玉",
    "ミュージックスターマイン", "ワイドスターマイン", "ドローンショー",
    "昼花火", "競技花火", "フィナーレ", "Shorts"
]

EXCLUDE_KEYWORDS = [
    "スターレイル", "honkai", "star rail", "原神", "genshin", "モンスト", "パズドラ",
    "マイクラ", "minecraft", "歌ってみた", "music video", "official video", "official audio",
    "踊ってみた", "covered by", "作詞", "作曲", "piano", "ピアノ演奏", "吹奏楽"
]

def parse_iso_datetime(date_str):
    """様々な日付文字列をUTCのaware datetimeに正規化"""
    if not date_str:
        return datetime.now(timezone.utc)
    try:
        # ISO 8601
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        pass
    
    try:
        # RFC 2822
        import email.utils
        parsed = email.utils.parsedate_to_datetime(date_str)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed
    except Exception:
        return datetime.now(timezone.utc)

def extract_category_and_tags(title, description="", default_category="全国有名花火大会"):
    text = f"{title} {description}"
    category = default_category
    for cat_name, keywords in CATEGORY_KEYWORDS:
        if any(kw in text for kw in keywords):
            category = cat_name
            break

    tags = []
    for tag in TAG_KEYWORDS:
        if tag.lower() in text.lower():
            if tag not in tags:
                tags.append(tag)

    if "#shorts" in text.lower() or "shorts" in text.lower():
        if "Shorts" not in tags:
            tags.append("Shorts")

    return category, tags

def fetch_youtube_rss_videos(channel_info):
    """YouTubeのRSSフィードから最新動画を取得"""
    channel_id = channel_info.get("channel_id")
    default_cat = channel_info.get("default_category", "全国有名花火大会")
    default_reg = channel_info.get("default_region", "全国")

    if not channel_id:
        return []

    rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    print(f"[YouTube RSS] 取得中: {channel_info.get('name')} ({channel_id})")

    feed = feedparser.parse(rss_url)
    videos = []

    for entry in feed.entries:
        video_id = entry.yt_videoid if hasattr(entry, 'yt_videoid') else entry.id.split(':')[-1]
        title = entry.title
        link = entry.link
        published = entry.published if hasattr(entry, 'published') else datetime.now(timezone.utc).isoformat()
        author = entry.author if hasattr(entry, 'author') else channel_info.get("name")
        description = entry.summary if hasattr(entry, 'summary') else ""

        category, tags = extract_category_and_tags(title, description, default_cat)
        is_shorts = "Shorts" in tags or "/shorts/" in link

        dt = parse_iso_datetime(published)

        videos.append({
            "id": f"yt_{video_id}",
            "original_id": video_id,
            "title": title,
            "platform": "youtube_shorts" if is_shorts else "youtube",
            "videoUrl": f"https://www.youtube.com/watch?v={video_id}",
            "embedUrl": f"https://www.youtube-nocookie.com/embed/{video_id}?autoplay=1",
            "authorName": author,
            "authorUrl": f"https://www.youtube.com/channel/{channel_id}",
            "thumbnailUrl": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
            "publishedAt": dt.isoformat(),
            "category": category,
            "region": default_reg,
            "tags": tags,
            "description": description[:180] + ("..." if len(description) > 180 else ""),
        })

    return videos

def fetch_youtube_search_videos(query_item):
    """yt-dlpを用いてYouTube検索結果から高画質・最新花火動画を取得"""
    query = query_item.get("query")
    max_results = query_item.get("max_results", 5)
    default_cat = query_item.get("default_category", "全国有名花火大会")
    default_reg = query_item.get("default_region", "全国")

    search_query = f"ytsearch{max_results}:{query}"
    print(f"[YouTube 検索] 取得中: '{query}' (最大{max_results}件)")

    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'skip_download': True,
    }

    videos = []
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            res = ydl.extract_info(search_query, download=False)
            entries = res.get('entries', []) if res else []
            for entry in entries:
                if not entry:
                    continue
                video_id = entry.get('id')
                title = entry.get('title')
                if not video_id or not title:
                    continue

                # ノイズ（ゲーム実況や楽曲カバーなど）を除外
                lower_title = title.lower()
                if any(ex in lower_title for ex in EXCLUDE_KEYWORDS):
                    print(f"  [スキップ (ノイズ除外)]: {title}")
                    continue

                url = entry.get('url') or f"https://www.youtube.com/watch?v={video_id}"
                channel = entry.get('channel') or entry.get('uploader') or "花火アーカイブ"
                channel_id = entry.get('channel_id') or entry.get('uploader_id') or ""

                category, tags = extract_category_and_tags(title, default_category=default_cat)
                
                # 再生時間によるShorts判定 (60秒以下)
                duration = entry.get('duration') or 0
                is_shorts = (0 < duration <= 60) or ("Shorts" in tags) or ("/shorts/" in url)
                if is_shorts and "Shorts" not in tags:
                    tags.append("Shorts")

                # タイムスタンプ取得 (yt-dlp timestamp)
                timestamp = entry.get('timestamp')
                if timestamp:
                    dt = datetime.fromtimestamp(timestamp, timezone.utc)
                else:
                    dt = datetime.now(timezone.utc)

                videos.append({
                    "id": f"yt_{video_id}",
                    "original_id": video_id,
                    "title": title,
                    "platform": "youtube_shorts" if is_shorts else "youtube",
                    "videoUrl": url,
                    "embedUrl": f"https://www.youtube-nocookie.com/embed/{video_id}?autoplay=1",
                    "authorName": channel,
                    "authorUrl": f"https://www.youtube.com/channel/{channel_id}" if channel_id else f"https://www.youtube.com/results?search_query={urllib.parse.quote(channel)}",
                    "thumbnailUrl": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
                    "publishedAt": dt.isoformat(),
                    "category": category,
                    "region": default_reg,
                    "tags": tags,
                    "description": title,
                })
    except Exception as e:
        print(f"[YouTube 検索] エラー ('{query}'): {e}")

    return videos

def fetch_tiktok_oembed(item):
    """TikTok公式 oEmbed API から動画情報を取得"""
    url = item.get("url")
    if not url:
        return None

    video_id_match = re.search(r'/video/(\d+)', url)
    video_id = video_id_match.group(1) if video_id_match else f"tt_{abs(hash(url))}"

    default_cat = item.get("category", "全国有名花火大会")
    default_reg = item.get("region", "日本")

    oembed_url = f"https://www.tiktok.com/oembed?url={urllib.parse.quote(url, safe='')}"
    print(f"[TikTok] メタデータ取得中: {url}")

    title = item.get("title", "花火動画")
    author_name = item.get("author_name", "TikTokクリエイター")
    author_url = f"https://www.tiktok.com/@{author_name}"
    thumbnail_url = item.get("thumbnailUrl", "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop")
    embed_html = None

    try:
        req = urllib.request.Request(oembed_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode('utf-8'))
                title = data.get("title") or title
                author_name = data.get("author_name") or author_name
                author_url = data.get("author_url") or author_url
                thumbnail_url = data.get("thumbnail_url") or thumbnail_url
                embed_html = data.get("html")
                print(f"[TikTok] oEmbed 取得成功: '{title[:30]}...'")
    except Exception as e:
        print(f"[TikTok] oEmbedレスポンスなし (設定値を使用): {e}")

    category, tags = extract_category_and_tags(title, default_category=default_cat)
    if "TikTok" not in tags:
        tags.append("TikTok")

    dt = parse_iso_datetime(item.get("publishedAt"))

    return {
        "id": f"tt_{video_id}",
        "original_id": video_id,
        "title": title,
        "platform": "tiktok",
        "videoUrl": url,
        "embedUrl": f"https://www.tiktok.com/embed/v2/{video_id}",
        "embedHtml": embed_html,
        "authorName": author_name,
        "authorUrl": author_url,
        "thumbnailUrl": thumbnail_url,
        "publishedAt": dt.isoformat(),
        "category": category,
        "region": default_reg,
        "tags": tags,
        "description": title,
    }

def main():
    print("==========================================")
    print("   花火動画 自動収集・最新情報更新処理   ")
    print("==========================================")

    if not os.path.exists(SOURCES_FILE):
        print(f"エラー: ソース設定ファイルが見つかりません: {SOURCES_FILE}")
        return

    with open(SOURCES_FILE, 'r', encoding='utf-8') as f:
        sources = json.load(f)

    existing_videos = {}
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                old_list = json.load(f)
                for v in old_list:
                    existing_videos[v['id']] = v
        except Exception as e:
            print(f"既存の動画データ読み込み警告: {e}")

    new_videos = []

    # 1. YouTubeチャンネル巡回 (RSS)
    for ch in sources.get("youtube_channels", []):
        try:
            vids = fetch_youtube_rss_videos(ch)
            new_videos.extend(vids)
            print(f"  -> 完了: {len(vids)}件 取得")
        except Exception as e:
            print(f"[YouTube チャンネル] エラー ({ch.get('name')}): {e}")

    # 2. YouTube検索クエリ巡回 (yt-dlp)
    for q in sources.get("youtube_search_queries", []):
        try:
            vids = fetch_youtube_search_videos(q)
            new_videos.extend(vids)
            print(f"  -> 完了: {len(vids)}件 取得")
        except Exception as e:
            print(f"[YouTube 検索] エラー: {e}")

    # 3. TikTok動画巡回 (oEmbed)
    for item in sources.get("tiktok_videos", []):
        try:
            tt_data = fetch_tiktok_oembed(item)
            if tt_data:
                new_videos.append(tt_data)
        except Exception as e:
            print(f"[TikTok] エラー: {e}")

    # 重複排除 & マージ
    for v in new_videos:
        existing_videos[v['id']] = v

    video_list = list(existing_videos.values())

    # 日付降順ソート
    video_list.sort(key=lambda x: parse_iso_datetime(x.get("publishedAt")), reverse=True)

    # 保存
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    os.makedirs(os.path.dirname(SRC_OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(video_list, f, ensure_ascii=False, indent=2)

    with open(SRC_OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(video_list, f, ensure_ascii=False, indent=2)

    # 統計サマリーの書き出し
    stats = {
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "totalVideos": len(video_list),
        "platforms": {
            "youtube": len([v for v in video_list if v["platform"] == "youtube"]),
            "youtube_shorts": len([v for v in video_list if v["platform"] == "youtube_shorts"]),
            "tiktok": len([v for v in video_list if v["platform"] == "tiktok"]),
        },
        "categories": {}
    }
    for v in video_list:
        cat = v.get("category", "その他")
        stats["categories"][cat] = stats["categories"].get(cat, 0) + 1

    stats_file = os.path.join(BASE_DIR, "data", "stats.json")
    src_stats_file = os.path.join(BASE_DIR, "src", "data", "stats.json")
    with open(stats_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    with open(src_stats_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print("\n==========================================")
    print("【更新サマリー】")
    print(f"総登録動画数: {len(video_list)} 件")
    print(f" - YouTube (通常): {stats['platforms']['youtube']} 件")
    print(f" - YouTube (Shorts): {stats['platforms']['youtube_shorts']} 件")
    print(f" - TikTok: {stats['platforms']['tiktok']} 件")
    print("大会・カテゴリ内訳:")
    for cat, count in stats["categories"].items():
        print(f"  * {cat}: {count}件")
    print(f"最終更新日時: {stats['lastUpdated']}")
    print("==========================================")

if __name__ == "__main__":
    main()
