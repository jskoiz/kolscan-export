'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Kol = {
  name: string;
  address: string;
  realizedPnl: string;
  realizedPnlUsd: string;
  pfpUrl?: string;
  twitterUrl?: string;
};

type ExportWallet = {
  address: string;
  name: string;
  emoji: string;
};

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-gray-400 group-hover:text-white transition-colors">
      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.142 0-.282-.008-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
    </svg>
  );

export default function Home() {
  const [leaderboardData, setLeaderboardData] = useState<Kol[]>([]);
  const [selectedKols, setSelectedKols] = useState<Set<string>>(new Set());
  const [exportedJson, setExportedJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
        }
        const data: Kol[] = await response.json();
        setLeaderboardData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (address: string) => {
    const newSelectedKols = new Set(selectedKols);
    if (newSelectedKols.has(address)) {
      newSelectedKols.delete(address);
    } else {
      newSelectedKols.add(address);
    }
    setSelectedKols(newSelectedKols);
  };

  const handleSelectAll = () => {
    if (selectedKols.size === leaderboardData.length) {
      setSelectedKols(new Set());
    } else {
      const allAddresses = new Set(leaderboardData.map(kol => kol.address));
      setSelectedKols(allAddresses);
    }
  };

  const handleExport = () => {
    const emojis = ['🐋', '🦑', '🐙', '🐬', '🐠', '🐡', '🦈', '🦀', '🦞', '🦐', '🐳', '🐟', '🦐', '🦑', '🦀', '🦞', '🐙', '🐬', '🐠', '🐡', '🦈'];

    // Fisher-Yates shuffle
    for (let i = emojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emojis[i], emojis[j]] = [emojis[j], emojis[i]];
    }

    const walletsToExport: ExportWallet[] = leaderboardData
      .filter(kol => selectedKols.has(kol.address))
      .map((kol, index) => ({
        address: kol.address,
        name: kol.name,
        emoji: emojis[index % emojis.length],
      }));
    setExportedJson(JSON.stringify(walletsToExport, null, 2));
  };
  
  const handleCopy = () => {
    if (exportedJson) {
      navigator.clipboard.writeText(exportedJson).then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-12 md:p-24 bg-gray-900 text-gray-200 font-sans">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">KOLScan Exporter</h1>
        <p className="text-gray-400 mb-8">Select KOLs from the leaderboard to export for bulk import.</p>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-3">
            <h2 className="text-lg font-semibold">Leaderboard ({leaderboardData.length} KOLs)</h2>
            <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
            >
              {selectedKols.size === leaderboardData.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {isLoading ? (
            <div className="text-center p-8">Loading Leaderboard...</div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">Error: {error}</div>
          ) : (
            <div className="max-h-96 overflow-y-auto pr-2">
              {leaderboardData.map((kol, index) => (
                <div key={kol.address} className="flex items-center space-x-4 p-3 my-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    id={`kol-${index}`}
                    checked={selectedKols.has(kol.address)}
                    onChange={() => handleCheckboxChange(kol.address)}
                    className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600 self-start mt-3"
                  />
                  {kol.pfpUrl && (
                    <Image
                      src={kol.pfpUrl}
                      alt={`${kol.name}'s profile picture`}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                  <div className="flex-grow flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">{kol.name}</span>
                        {kol.twitterUrl && (
                          <a href={kol.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 group">
                            <XIcon />
                          </a>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 font-mono mt-1">{kol.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-400 text-lg">{kol.realizedPnl} Sol</div>
                      <div className="text-sm text-gray-400">(${kol.realizedPnlUsd})</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleExport}
            className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-500"
            disabled={selectedKols.size === 0}
          >
            Export {selectedKols.size} Selected KOLs
          </button>
        </div>

        {exportedJson && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Exported Data</h2>
            <div className="relative">
              <textarea
                readOnly
                value={exportedJson}
                className="w-full h-80 p-4 font-mono text-sm bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Exported JSON will appear here..."
              />
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-xs font-medium"
              >
                {copyButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
