import React, { useState, useEffect } from "react";
import { Undo, Redo } from "@mui/icons-material";
import { usePrevious } from "@radix-ui/react-use-previous";
import { useUndoRedo } from "./useUndoRedo";
import { IExperiment } from "../../types/types";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { JsonOperationPack, jsonApplyItem } from "../../Utils/JsonPatch";
import { useExperiments } from "../../Context/useExperiments";

export const UndoRedoButtons = () => {
    const { trackChanges, setTrackChanges, obtainUndo, obtainRedo, undoStack, redoStack } = useUndoRedo();
    const { experiments, setAllExperiments } = useExperiments();
    const [waitForOperation, setWaitForOperation] = useState(false);
    const prevExperiments: IExperiment[] = usePrevious(experiments);

    const doOperation = (experimentName: string | undefined, patch: JsonOperationPack | undefined) => {
        if (experimentName && patch) {
            setWaitForOperation(true);
            setTrackChanges(false);
            setAllExperiments((prev: IExperiment[]) => {
                const i = prev.findIndex(t => t.name === experimentName);
                const draft = structuredClone(prev);
                jsonApplyItem(draft, i, draft[i], patch);
                return draft;
            });
        }
    }

    // Starting to track again the changes in experiments only after the undo operation has been done
    // This is to avoid adding the undo operation into the undo stack itself
    useEffect(() => {
        if (waitForOperation && !trackChanges) {
            if (JSON.stringify(prevExperiments) !== JSON.stringify(experiments)) {
                setWaitForOperation(false);
                setTrackChanges(true);
            }
        }
    }, [experiments, trackChanges, waitForOperation]);

    return (
        <>
            <ButtonTooltip
                color="inherit"
                onClick={() => {
                    const { name, undoPatch } = obtainUndo() || {};
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