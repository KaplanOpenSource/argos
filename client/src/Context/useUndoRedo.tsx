import { create } from "zustand";
import { IExperiment } from "../types/types";
import { useEffect } from "react";
import { Operation } from "fast-json-patch";
import { useExperimentProvider } from "./ExperimentProvider";
import { usePrevious } from '@radix-ui/react-use-previous';

type UndoRedoPacket = Operation[];

interface UndoRedoStore {
    undoStack: UndoRedoPacket[],
    redoStack: UndoRedoPacket[],
    trackChanges: boolean,
    setTrackChanges: (v: boolean) => void,

    // serverUpdates: { name: string, exp: IExperiment }[];
    // addUpdate: (name: string, exp: IExperiment) => void;
}

export const useUndoRedo = create<UndoRedoStore>()((set, get) => ({
    undoStack: [],
    redoStack: [],
    trackChanges: false,
    setTrackChanges: (v: boolean) => set({ trackChanges: v }),
    // serverUpdates: [],
    // addUpdate: (name: string, exp: IExperiment) => {
    //     set(prev => ({ ...prev, serverUpdates: [...prev.serverUpdates, { name, exp }] }))
    // },
}))


export const UndoRedoHandler = () => {
    // const { clearUpdates, serverUpdates } = useServerUpdates();
    // const { isLoggedIn } = useTokenStore();
    // const { saveExperimentWithData } = useFetchExperiments();

    const { experiments } = useExperimentProvider() as { experiments: IExperiment[] };
    const prevExperiments: IExperiment[] = usePrevious(experiments);
    const { trackChanges } = useUndoRedo();

    useEffect(() => {
        if (trackChanges) {
            console.log('before:', prevExperiments, 'after:', experiments);
        }
    }, [experiments, prevExperiments]);



    // useEffect(() => {
    //     (async () => {
    //         if (serverUpdates.length && isLoggedIn()) {
    //             for (const { name, exp } of serverUpdates) {
    //                 const ok = await saveExperimentWithData(name, exp);
    //                 if (!ok) {
    //                     return;
    //                 }
    //             }
    //             clearUpdates();
    //         }
    //     })();
    // }, [serverUpdates, isLoggedIn()])
    return null;
}