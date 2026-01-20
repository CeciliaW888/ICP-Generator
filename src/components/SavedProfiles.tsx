import React from 'react';
import { SavedICP } from '../services/storage';
import { Trash2, ArrowRight, Calendar, Building2, TrendingUp } from 'lucide-react';

interface SavedProfilesProps {
    profiles: SavedICP[];
    onLoad: (profile: SavedICP) => void;
    onDelete: (id: string) => void;
}

export const SavedProfiles: React.FC<SavedProfilesProps> = ({ profiles, onLoad, onDelete }) => {

    if (profiles.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No saved profiles yet</h3>
                <p className="text-gray-500 mt-1">Generate a profile and click "Save" to build your library.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Saved Profiles
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {profiles.length}
                </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">

                        {/* Card Header */}
                        <div className="p-5 border-b border-gray-100 flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{profile.targetName}</h3>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                <Calendar className="w-3 h-3" />
                                {new Date(profile.dateSaved).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>

                            {/* Quick Preview Chips */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    <span className="truncate">{profile.firmographics.companySize}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    <span className="truncate">{profile.buyingSignals[0]?.signal || "No recent signals"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="p-4 bg-gray-50 rounded-b-xl border-t border-gray-100 flex items-center justify-between gap-3">
                            <button
                                onClick={() => onDelete(profile.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Profile"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => onLoad(profile)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 shadow-sm text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-brand transition-colors"
                            >
                                View Profile
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
