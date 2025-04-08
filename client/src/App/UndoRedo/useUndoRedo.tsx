import { useEffect } from "react";
import { create } from "zustand";
import { IExperiment } from "../../types/types";
import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { usePrevious } from '@radix-ui/react-use-previous';
import { jsonCompare, JsonOperationPack } from "../../Utils/JsonPatch";

type JsonUndoRedoChange = {
    name: string,
    undoPatch: JsonOperationPack,
    redoPatch: JsonOperationPack,
};

interface UndoRedoStore {
    undoStack: JsonUndoRedoChange[],
    redoStack: JsonUndoRedoChange[],
    trackChanges: boolean,
    setTrackChanges: (v: boolean) => void,
    setStacks: (newUndoStack: JsonUndoRedoChange[], newRedoStack: JsonUndoRedoChange[]) => void,
    obtainUndo: () => JsonUndoRedoChange | undefined,
    obtainRedo: () => JsonUndoRedoChange | undefined,
}

export const useUndoRedo = create<UndoRedoStore>()((set, get) => ({
    undoStack: [],
    redoStack: [],
    trackChanges: false,
    setTrackChanges: (v: boolean) => {
        set({ trackChanges: v })
    },
    setStacks: (
        newUndoStack: JsonUndoRedoChange[],
        newRedoStack: JsonUndoRedoChange[],
    ) => set({
        redoStack: newRedoStack,
        undoStack: newUndoStack,
    }),
    obtainUndo: () => {
        const { undoStack: [item, ...rest], redoStack } = get();
        if (item) {
            set({ undoStack: rest, redoStack: [item, ...redoStack] });
        }
        return item;
    },
    obtainRedo: () => {
        const { redoStack: [item, ...rest], undoStack } = get();
        if (item) {
            set({ redoStack: rest, undoStack: [item, ...undoStack] });
        }
        return item;
    },
}))

/** comparing experiment before and after change and returns an undo redo patches
 * since jsonCompare cannot identify removal correctly, there's an exhaustive search
 * TODO: get a better changes detection package */
const compareExperiments = (
    prevExperiments: IExperiment[],
    nextExperiments: IExperiment[],
): JsonUndoRedoChange | undefined => {
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
            const name = (missOnPrev || missOnNext)?.name!;
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
    const { trackChanges, setStacks, undoStack } = useUndoRedo();

    useEffect(() => {
        if (trackChanges) {
            const op = compareExperiments(prevExperiments, experiments);
            if (op) {
                console.log(op);
                setStacks([...undoStack, op], [])
            }
        }
    }, [experiments, prevExperiments]);

    return null;
}
