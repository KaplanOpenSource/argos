import { create } from "zustand";
import { IExperiment } from "../types/types";
import { useTokenStore } from "./useTokenStore";
import { useFetchExperiments } from "./FetchExperiment";
import { useEffect } from "react";

interface ServerUpdatesStore {
    serverUpdates: { name: string, exp: IExperiment }[];
    addUpdate: (name: string, exp: IExperiment) => void;
    upsync: () => Promise<void>;
}

export const useServerUpdates = create<ServerUpdatesStore>()((set, get) => ({
    serverUpdates: [],
    addUpdate: (name: string, exp: IExperiment) => {
        set(prev => ({ ...prev, serverUpdates: [...prev.serverUpdates, { name, exp }] }))
    },
    upsync: async () => {
        const serverUpdates = get().serverUpdates;
        if (serverUpdates.length && useTokenStore.getState().isLoggedIn()) {
            for (const { name, exp } of serverUpdates) {

                // TODO: convert useFetchExperiments to zustand to do the following in saveExperimentWithData there
                try {
                    await useTokenStore.getState().axiosSecure().post("experiment_set/" + name, exp);
                } catch (e) {
                    alert('save error: ' + e);
                    console.error(e);
                }
                ////
                
            }
            set({ serverUpdates: [] })
        }
    }
}))

export const ServerUpdatesHandler = () => {
    const { upsync, serverUpdates } = useServerUpdates();
    useEffect(() => {
        upsync();
    }, [serverUpdates])
    return null;
}