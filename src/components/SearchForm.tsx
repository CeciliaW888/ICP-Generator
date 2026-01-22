import React, { useState } from 'react';
import { Search, Loader2, ShieldAlert } from 'lucide-react';

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
        <p className="text-gray-500 mb-6">
          Enter a company name or industry segment to generate a comprehensive profile using live web intelligence.
        </p>

        {/* ICP Definition for New Sales Reps */}
        <div className="mb-8 bg-blue-50 rounded-lg p-4 border border-blue-100 flex gap-3 text-sm text-blue-800">
          <div className="min-w-[4px] bg-blue-500 rounded-full" />
          <p>
            <span className="font-bold">What is an ICP?</span> An <span className="italic">Ideal Customer Profile</span> defines the perfect prospect for Blackwoods—analyzing their size, safety risks, and buying urgency to help you focus on high-value accounts.
          </p>
        </div>

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
            className="absolute right-2 top-2 h-10 w-10 bg-brand hover:bg-brand-hover text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mb-8 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3 h-3" />
          <span>Please do not enter confidential information or PII.</span>
        </p>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggested Searches</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(suggestion);
                  if (!isLoading) onSearch(suggestion);
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
