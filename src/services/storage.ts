import { ICPData } from '../types';

export interface SavedICP extends ICPData {
    id: string;
    dateSaved: string; // ISO string
    query: string;
}

const STORAGE_KEY = 'icp_saved_profiles';

// Helper to generate a simple unique ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const saveProfile = (data: ICPData, query: string): SavedICP => {
    const savedProfile: SavedICP = {
        ...data,
        id: generateId(),
        dateSaved: new Date().toISOString(),
        query
    };

    const existing = getSavedProfiles();
    const updated = [savedProfile, ...existing];

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to save profile to LocalStorage", e);
        // Handle quota exceeded error silently or throw if needed
    }

    return savedProfile;
};

export const getSavedProfiles = (): SavedICP[] => {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) return [];
        return JSON.parse(json) as SavedICP[];
    } catch (e) {
        console.error("Failed to read profiles from LocalStorage", e);
        return [];
    }
};

export const deleteProfile = (id: string): void => {
    const existing = getSavedProfiles();
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
