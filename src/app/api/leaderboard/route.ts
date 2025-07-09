import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

type Kol = {
  name: string;
  address: string;
  realizedPnl: string;
  realizedPnlUsd: string;
  pfpUrl?: string;
  twitterUrl?: string;
};

let cache: { data: Kol[] | null; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchAndParseLeaderboard(): Promise<Kol[]> {
  const { data: html } = await axios.get('https://kolscan.io/leaderboard', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  const $ = cheerio.load(html);
  const kols: Kol[] = [];

  $('[class*="leaderboard_leaderboardUser__"]').each((_, el) => {
    const name = $(el).find('a h1').text().trim();
    const href = $(el).find('a').attr('href') || '';
    const address = href.split('/').pop() || '';

    let pfpUrl = $(el).find('img').attr('src') || '';
    if (pfpUrl.startsWith('/')) {
      pfpUrl = `https://kolscan.io${pfpUrl}`;
    }

    const twitterUrl =
      $(el).find('a[href*="twitter.com"], a[href*="x.com"]').attr('href') ||
      $(el).find('a:has(img[alt="twitter logo"])').attr('href') ||
      '';

    const profitEl = $(el).find('[class*="leaderboard_totalProfitNum__"]');
    const realizedPnl = profitEl.find('h1').eq(0).text().replace('Sol', '').trim();
    const realizedPnlUsd = profitEl
      .find('h1')
      .eq(1)
      .text()
      .replace(/[\(\)\$]/g, '')
      .trim();

    if (name && address) {
      kols.push({ name, address, realizedPnl, realizedPnlUsd, pfpUrl, twitterUrl });
    }
  });

  return kols;
}

export async function GET() {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  const kols = await fetchAndParseLeaderboard();
  if (kols.length > 0) {
    cache = { data: kols, timestamp: now };
  }
  return NextResponse.json(kols);
}
