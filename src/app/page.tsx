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

  useEffect(() => {
    if (selectedKols.size === 0) {
      setExportedJson('');
      return;
    }

    const emojis = [
      '🐋', '🦑', '🐙', '🐬', '🐠', '🐡', '🦈', '🦀', '🦞', '🦐', '🐳', '🐟',
      '🐢', '🐸', '🐍', '🦎', '🐊', '🐅', '🐆', '🦓', '🦍', '🐘', '🦏', '🐪',
      '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕',
      '🐩', '🐈', '🐓', '🦃', '🕊', '🦅', '🦆', '🦉', '🦇', '🐺', '🐗', '🐴',
      '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🕷', '🦂', '🦟', '🦠'
    ];
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
  }, [selectedKols, leaderboardData]);

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
  
  const handleCopy = () => {
    if (exportedJson) {
      navigator.clipboard.writeText(exportedJson).then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 bg-gray-900 text-gray-100">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 text-white">kolscan.io Exporter</h1>
          <p className="text-gray-400 text-lg">Select KOLs from the leaderboard to export for bulk import.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/5 bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
              <h2 className="text-2xl font-semibold text-white">Leaderboard ({leaderboardData.length} KOLs)</h2>
              <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedKols.size === leaderboardData.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {isLoading ? (
              <div className="text-center p-8 text-gray-400">Loading Leaderboard...</div>
            ) : error ? (
              <div className="text-center p-8 text-red-500">Error: {error}</div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {leaderboardData.map((kol, index) => (
                  <div key={kol.address} className="flex items-center space-x-4 p-3 my-2 bg-gray-800 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-500" onClick={() => handleCheckboxChange(kol.address)}>
                    <input
                      type="checkbox"
                      id={`kol-${index}`}
                      checked={selectedKols.has(kol.address)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(kol.address);
                      }}
                      className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 self-start mt-3"
                    />
                    {kol.pfpUrl ? (
                      <Image
                        src={kol.pfpUrl}
                        alt={`${kol.name}'s profile picture`}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xl">🏆</span>
                      </div>
                    )}
                    <div className="flex-grow flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-white">{kol.name}</span>
                          {kol.twitterUrl && (
                            <a href={kol.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 group">
                              <XIcon />
                            </a>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 font-mono mt-1 break-all">{kol.address}</div>
                      </div>
                      <div className="text-right pl-4">
                        <div className="font-semibold text-green-400 text-lg whitespace-nowrap">{kol.realizedPnl} Sol</div>
                        <div className="text-sm text-gray-400 whitespace-nowrap">(${kol.realizedPnlUsd})</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-2/5">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 sticky top-8 flex flex-col h-full">
              <h2 className="text-2xl font-semibold mb-4 text-white">Exported Data</h2>
              <div className="relative flex-grow">
                <textarea
                  readOnly
                  value={exportedJson}
                  className="w-full h-full p-4 font-mono text-sm bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-300 custom-scrollbar"
                  placeholder="Select KOLs from the leaderboard to see the export data here..."
                />
                {exportedJson && (
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-xs font-medium text-white transition-colors"
                  >
                    {copyButtonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
