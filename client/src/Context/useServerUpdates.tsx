import { useEffect } from "react";
import { create } from "zustand";
import { IExperiment } from "../types/types";
import { useFetchExperiments } from "./FetchExperiment";
import { useTokenStore } from "./useTokenStore";

interface ServerUpdatesStore {
  serverUpdates: { name: string, exp: IExperiment | undefined }[];
  sendUpdate: (name: string, exp: IExperiment | undefined) => void;
  clearUpdates: () => void;
}

export const useServerUpdates = create<ServerUpdatesStore>()((set, get) => ({
  serverUpdates: [],
  sendUpdate: (name: string, exp: IExperiment | undefined) => {
    set(prev => ({ ...prev, serverUpdates: [...prev.serverUpdates, { name, exp }] }))
  },
  clearUpdates: () => {
    set({ serverUpdates: [] })
  }
}))

export const ServerUpdatesHandler = () => {
  const { clearUpdates, serverUpdates } = useServerUpdates();
  const { isLoggedIn } = useTokenStore();
  const { saveExperimentWithData } = useFetchExperiments();

  useEffect(() => {
    (async () => {
      if (serverUpdates.length && isLoggedIn()) {
        for (const { name, exp } of serverUpdates) {
          const ok = await saveExperimentWithData(name, exp);
          if (!ok) {
            return;
          }
        }
        clearUpdates();
      }
    })();
  }, [serverUpdates, isLoggedIn()])
  return null;
}