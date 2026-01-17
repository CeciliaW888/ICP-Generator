import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const suggestions = [
    "BHP Western Australia Iron Ore",
    "Mid-tier Construction Companies in Sydney",
    "Food Manufacturing in Victoria",
    "Rio Tinto Pilbara Operations",
    "Logistics & Warehousing Providers Brisbane"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Build Your ICP</h2>
        <p className="text-gray-500 mb-8">
          Enter a company name or industry segment to generate a comprehensive profile using live web intelligence.
        </p>

        <form onSubmit={handleSubmit} className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g. 'Gold Mining in Kalgoorlie' or 'John Holland Group'"
            className="w-full h-14 pl-6 pr-16 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none text-lg transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-2 h-10 w-10 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </form>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggested Searches</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(suggestion);
                  if(!isLoading) onSearch(suggestion);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm rounded-md border border-gray-200 transition-colors text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
