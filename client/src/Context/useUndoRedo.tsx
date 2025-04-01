import { create } from "zustand";
import { IExperiment } from "../types/types";
import { useEffect } from "react";
import { useExperimentProvider } from "./ExperimentProvider";
import { usePrevious } from '@radix-ui/react-use-previous';
import { jsonCompare, JsonOperationPack } from "../Utils/JsonPatch";

interface UndoRedoStore {
    undoStack: JsonOperationPack[],
    redoStack: JsonOperationPack[],
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

/** comparing experiment before and after change and returns an undo redo patches
 * since jsonCompare cannot identify removal correctly, there's an exhaustive search
 * TODO: get a better changes detection package */
const compareExperiments = (
    prevExperiments: IExperiment[],
    nextExperiments: IExperiment[],
): { name: string, undoPatch: JsonOperationPack, redoPatch: JsonOperationPack } | undefined => {
    if (nextExperiments.length === prevExperiments.length) {
        for (let i = 0; i < nextExperiments.length; i++) {
            const redoPatch = jsonCompare(prevExperiments[i], nextExperiments[i]);
            if (redoPatch.length) {
                return {
                    name: prevExperiments[i].name!,
                    redoPatch,
                    undoPatch: jsonCompare(nextExperiments[i], prevExperiments[i]),
                }
            }
        }
    } else {
        const missOnNext = nextExperiments.find(e => !prevExperiments.find(p => p.name === e.name));
        const missOnPrev = prevExperiments.find(p => !nextExperiments.find(e => p.name === e.name));
        if (missOnNext || missOnPrev) {
            const name = (missOnNext || missOnPrev)?.name!;
            return {
                name,
                redoPatch: jsonCompare(missOnPrev, missOnNext),
                undoPatch: jsonCompare(missOnNext, missOnPrev),
            }
        }
    }
    return undefined;
}

export const UndoRedoHandler = () => {
    const { experiments } = useExperimentProvider() as { experiments: IExperiment[] };
    const prevExperiments: IExperiment[] = usePrevious(experiments);
    const { trackChanges } = useUndoRedo();

    useEffect(() => {
        if (trackChanges) {
            const op = compareExperiments(prevExperiments, experiments);
            if (op) {
                console.log(op);
            }
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