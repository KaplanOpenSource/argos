import { create } from "zustand";
import { IExperiment } from "../types/types";
import { useEffect } from "react";
import { useExperimentProvider } from "./ExperimentProvider";
import { usePrevious } from '@radix-ui/react-use-previous';
import { jsonApplyItem, jsonCompare, JsonOperationPack } from "../Utils/JsonPatch";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { Redo, Undo } from "@mui/icons-material";
import React from "react";

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
            set({ undoStack: rest, redoStack: [...redoStack, item] });
        }
        return item;
    },
    obtainRedo: () => {
        const { redoStack: [item, ...rest], undoStack } = get();
        if (item) {
            set({ redoStack: rest, undoStack: [...undoStack, item] });
        }
        return item;
    },
    // applyUndo: (setExperiments: (applyer: (prev: IExperiment[]) => IExperiment[]) => void) => {
    //     set(({ undoStack, redoStack }) => {
    //         if (undoStack.length) {
    //             const item = undoStack[0];
    //             setExperiments((prev: IExperiment[]) => {
    //                 const i = prev.findIndex(t => t.name === item.name);
    //                 jsonApplyItem(prev, i, prev[i], item.undoPatch);
    //                 return prev;
    //             });
    //             redoStack.push(item);
    //         }
    //         return { undoStack, redoStack };
    //     });
    // },
    // applyRedo: (setExperiments: (prev: IExperiment[]) => IExperiment[]) => {

    // },
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

export const UndoRedoButtons = () => {
    const { trackChanges, obtainUndo, obtainRedo, undoStack, redoStack } = useUndoRedo();
    const { experiments, setExperiments } = useExperimentProvider() as {
        experiments: IExperiment[],
        setExperiments: (applyer: (prev: IExperiment[]) => IExperiment[]) => void,
    };

    const doOperation = (experimentName: string | undefined, patch: JsonOperationPack | undefined) => {
        if (experimentName && patch) {
            setExperiments((prev: IExperiment[]) => {
                const i = prev.findIndex(t => t.name === experimentName);
                const draft = structuredClone(prev);
                jsonApplyItem(draft, i, draft[i], patch);
                return draft;
            });
        }
    }

    return (
        <>
            <ButtonTooltip
                color="inherit"
                // sx={{ mr: 2 }}
                onClick={() => {
                    const { name, undoPatch } = obtainUndo() || {};
                    console.log(name)
                    doOperation(name, undoPatch);
                }}
                tooltip={"Undo"}
                disabled={undoStack.length === 0}
            >
                <Undo />
            </ButtonTooltip>
            <ButtonTooltip
                color="inherit"
                // sx={{ mr: 2 }}
                onClick={() => {
                    const { name, redoPatch } = obtainRedo() || {};
                    doOperation(name, redoPatch);
                }}
                tooltip={"Redo"}
                disabled={redoStack.length === 0}
            >
                <Redo />
            </ButtonTooltip>
        </>
    )
}