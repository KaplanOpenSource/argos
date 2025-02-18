import { create } from "zustand";

type CacheState = {
    cache: {
        [key: string]: {
            data: string;
            lastAccessed: number;
        }
    };
    addCachedImage: (experimentName: string, imageName: string, data: string) => void;
    getCachedImage: (experimentName: string, imageName: string) => string | undefined;
}

const ONE_HOUR_AGO = 60 * 60 * 1000;

export const useImageCache = create<CacheState>()((set, get) => ({
    cache: {},
    addCachedImage: (experimentName, imageName, data) => {
        const now = Date.now();
        const cache = {};
        for (const [k, v] of Object.entries(get().cache)) {
            if (v.lastAccessed > now - ONE_HOUR_AGO) {
                cache[k] = v;
            }
        }

        const key = imageKey(experimentName, imageName);
        cache[key] = { data, lastAccessed: now };

        set({ cache });
    },
    getCachedImage: (experimentName, imageName) => {
        const origCache = get().cache;
        const key = imageKey(experimentName, imageName);
        const entry = origCache[key];
        if (entry) {
            const cache = { ...origCache };
            cache[key] = { ...entry, lastAccessed: Date.now() };
            set({ cache });
        }
        return entry?.data;
    },
}));

function imageKey(experimentName: string, imageName: string) {
    return `${experimentName}_${imageName}`;
}
