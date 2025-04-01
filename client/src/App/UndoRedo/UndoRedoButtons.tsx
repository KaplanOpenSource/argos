import React, { useState, useEffect } from "react";
import { Undo, Redo } from "@mui/icons-material";
import { usePrevious } from "@radix-ui/react-use-previous";
import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { useUndoRedo } from "../../Context/useUndoRedo";
import { IExperiment } from "../../types/types";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { JsonOperationPack, jsonApplyItem } from "../../Utils/JsonPatch";

export const UndoRedoButtons = () => {
    const { trackChanges, setTrackChanges, obtainUndo, obtainRedo, undoStack, redoStack } = useUndoRedo();
    const { experiments, setExperiments } = useExperimentProvider() as {
        experiments: IExperiment[],
        setExperiments: (applyer: (prev: IExperiment[]) => IExperiment[]) => void,
    };
    const [waitForOperation, setWaitForOperation] = useState(false);
    const prevExperiments: IExperiment[] = usePrevious(experiments);

    const doOperation = (experimentName: string | undefined, patch: JsonOperationPack | undefined) => {
        if (experimentName && patch) {
            setWaitForOperation(true);
            setTrackChanges(false);
            setExperiments((prev: IExperiment[]) => {
                const i = prev.findIndex(t => t.name === experimentName);
                const draft = structuredClone(prev);
                jsonApplyItem(draft, i, draft[i], patch);
                return draft;
            });
        }
    }

    // this is needed because (at the moment):
    // 1. experiments is in useContext which waits for the next render
    // 2. undo/redo is zustand which happens immmidiately
    // When experiments are moved to zustand, this can be removed
    useEffect(() => {
        if (waitForOperation && !trackChanges) {
            if (JSON.stringify(prevExperiments) !== JSON.stringify(experiments)) {
                setWaitForOperation(false);
                setTrackChanges(true);
            }
        }
    }, [experiments, trackChanges, waitForOperation]);

    console.log(undoStack, redoStack)
    return (
        <>
            <ButtonTooltip
                color="inherit"
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