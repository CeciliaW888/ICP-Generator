import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { ICPResult } from './components/ICPResult';
import { generateICP } from './services/gemini';
import { ICPData, GroundingSource } from './types';
import { LayoutDashboard, WifiOff } from 'lucide-react';
import { Logo } from './components/Logo';

// Helper to extract initials from email (e.g., "john.doe@company.com" -> "JD")
const getInitials = (email: string): string => {
  try {
    const [localPart] = email.split('@');
    const parts = localPart.split(/[._-]/).filter(Boolean);
    
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return localPart.slice(0, 2).toUpperCase();
  } catch (e) {
    return 'BW';
  }
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [icpData, setIcpData] = useState<ICPData | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mock logged-in user email updated for test
  const userEmail = "cecilia.wang@blackwoods.com.au";
  const userInitials = getInitials(userEmail);

  const isDemoMode = !process.env.API_KEY;

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setIcpData(null);
    setSources([]);

    try {
      const result = await generateICP(query);
      if (result.data) {
        setIcpData(result.data);
        setSources(result.sources);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white h-16 shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo displaying the local icon file */}
            <Logo />
            <span className="font-semibold text-gray-900 text-lg tracking-tight">ICP Generator</span>
            
            {isDemoMode && (
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 flex items-center gap-1 border border-gray-200">
                <WifiOff className="w-3 h-3" /> DEMO
              </span>
            )}
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-brand transition-colors">Dashboard</a>
            <a href="#" className="hover:text-brand transition-colors">Saved Profiles</a>
            <div 
              className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-semibold shadow-sm cursor-help transition-transform hover:scale-105"
              title={`Logged in as: ${userEmail}`}
            >
              {userInitials}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Search Hero */}
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
          <ICPResult data={icpData} sources={sources} />
        )}
      </main>
    </div>
  );
};

export default App;