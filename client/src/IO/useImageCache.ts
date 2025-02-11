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
        const cleanedCache = Object.fromEntries(
            Object.entries(get().cache).filter(([key, value]) => {
                const isRecent = value.lastAccessed > now - ONE_HOUR_AGO;
                return isRecent;
            })
        );
        set({
            cache: {
                ...cleanedCache,
                [imageKey(experimentName, imageName)]: { data, lastAccessed: now },
            },
        });
    },
    getCachedImage: (experimentName, imageName) => {
        const cache = get().cache;
        const key = imageKey(experimentName, imageName);
        if (cache[key]) {
            set({
                cache: {
                    ...cache,
                    [key]: { ...cache[key], lastAccessed: Date.now() },
                },
            });
        }
        return cache[key]?.data;
    },
}));

function imageKey(experimentName: string, imageName: string) {
    return `${experimentName}_${imageName}`;
}
