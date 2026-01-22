import React, { useState, useEffect } from 'react';
import { SearchForm } from './components/SearchForm';
import { ICPResult } from './components/ICPResult';
import { SavedProfiles } from './components/SavedProfiles';
import { generateICP } from './services/gemini';
import { ICPData, GroundingSource } from './types';
import { saveProfile, getSavedProfiles, deleteProfile, SavedICP } from './services/storage';
import { LayoutDashboard, WifiOff, AlertTriangle, BookMarked } from 'lucide-react';




const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [icpData, setIcpData] = useState<ICPData | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDemoMode = !import.meta.env.VITE_API_KEY;


  const [view, setView] = useState<'dashboard' | 'saved'>('dashboard');
  const [savedProfiles, setSavedProfiles] = useState<SavedICP[]>([]);
  const [lastQuery, setLastQuery] = useState(''); // Track query for saving

  // Load saved profiles on mount
  useEffect(() => {
    setSavedProfiles(getSavedProfiles());
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setIcpData(null);
    setSources([]);
    setIsFallbackMode(false);
    setView('dashboard'); // Ensure we go to dashboard on search
    setLastQuery(query);

    try {
      const result = await generateICP(query);
      if (result.data) {
        setIcpData(result.data);
        setSources(result.sources);
        setIsFallbackMode(!!result.isFallback);
      } else {
        setError("Could not generate a valid profile from the gathered data. Please try a more specific query.");
      }
    } catch (err) {
      setError("An error occurred while fetching intelligence. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (icpData) {
      const saved = saveProfile(icpData, lastQuery || icpData.targetName);
      setSavedProfiles(prev => [saved, ...prev]);
    }
  };

  const handleDelete = (id: string) => {
    deleteProfile(id);
    setSavedProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleLoad = (profile: SavedICP) => {
    setIcpData(profile);
    setSources([]); // Saved profiles don't store sources currently (could add later)
    setIsFallbackMode(false);
    setView('dashboard');
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white h-16 shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo displaying the local icon file */}
            <img src="/icons/icon-120.png" alt="Blackwoods Logo" className="w-8 h-8 rounded-lg flex-shrink-0" />

            {/* Dynamic Title for Mobile/Desktop */}
            <span className="font-semibold text-gray-900 text-lg tracking-tight truncate max-w-[200px] sm:max-w-none">
              {view === 'saved' ? 'Saved Profiles' : 'ICP Generator'}
            </span>

            {isDemoMode && (
              <span className="hidden sm:flex ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 items-center gap-1 border border-gray-200">
                <WifiOff className="w-3 h-3" /> DEMO
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-sm font-medium">
            <button
              onClick={() => setView('dashboard')}
              className={`transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-md ${view === 'dashboard'
                ? 'bg-[#002452]/10 text-[#002452]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setView('saved')}
              className={`transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-md ${view === 'saved'
                ? 'bg-[#002452]/10 text-[#002452]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              title="Saved Profiles"
            >
              <BookMarked className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline">Saved Profiles</span>
            </button>

            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200">
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Results or Saved Profiles */}
        {view === 'saved' ? (
          <SavedProfiles
            profiles={savedProfiles}
            onLoad={handleLoad}
            onDelete={handleDelete}
          />
        ) : (
          <>
            {/* Search Hero (Only show on Dashboard) */}
            <div className={`transition-all duration-500 ease-in-out ${icpData ? 'py-6' : 'py-20'}`}>
              <SearchForm onSearch={handleSearch} isLoading={loading} />
              {isDemoMode && !icpData && (
                <div className="max-w-4xl mx-auto px-4 mt-4 text-center">
                  <p className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 p-2 rounded inline-block">
                    ⚠️ Running in <strong>Demo Mode</strong> (No API Key detected). Search for "Mining", "Construction", or "Food" to see examples.
                  </p>
                </div>
              )}
            </div>

            {/* Fallback Warning Banner */}
            {isFallbackMode && icpData && (
              <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded shadow-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-orange-800 text-sm">Live Generation Failed</p>
                    <p className="text-orange-700 text-sm">
                      The AI service is currently unavailable or encountered an error. Showing <span className="font-semibold">Demo Data</span> instead.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="max-w-4xl mx-auto px-4 mb-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State / Intro */}
            {!icpData && !loading && !error && (
              <div className="max-w-4xl mx-auto px-4 text-center mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                  <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <LayoutDashboard className="w-8 h-8 mx-auto text-amber-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Firmographics</h3>
                    <p className="text-sm text-gray-500">Size, revenue, and site data sourced from the web.</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <LayoutDashboard className="w-8 h-8 mx-auto text-amber-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Buying Signals</h3>
                    <p className="text-sm text-gray-500">Recent projects, tenders, and news events.</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <LayoutDashboard className="w-8 h-8 mx-auto text-amber-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Decision Makers</h3>
                    <p className="text-sm text-gray-500">Key roles, pain points, and safety priorities.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="max-w-7xl mx-auto px-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="h-96 bg-gray-200 rounded-xl"></div>
                  <div className="h-96 bg-gray-200 rounded-xl"></div>
                  <div className="h-96 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            )}



            {/* Results */}
            {icpData && !loading && (
              <ICPResult data={icpData} sources={sources} onSave={handleSave} />
            )}
          </>
        )}
      </main>

      {/* Footer - Global */}
      <footer className="mt-auto py-6 text-center border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <p className="text-gray-400 text-xs font-medium">
          Brought to you by Blackwoods Data & Analytics CoE
        </p>
      </footer>
    </div>
  );
};

export default App;