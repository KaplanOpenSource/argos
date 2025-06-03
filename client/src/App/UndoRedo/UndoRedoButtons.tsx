import { Redo, Undo } from "@mui/icons-material";
import { usePrevious } from "@radix-ui/react-use-previous";
import { useEffect, useState } from "react";
import { useExperiments } from "../../Context/useExperiments";
import { IExperiment } from "../../types/types";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { JsonOperationPack, jsonApplyItem } from "../../Utils/JsonPatch";
import { useUndoRedo } from "./useUndoRedo";

export const UndoRedoButtons = () => {
  const { trackChanges, setTrackChanges, obtainUndo, obtainRedo, undoStack, redoStack } = useUndoRedo();
  const { experiments, setExperiment } = useExperiments();
  const [waitForOperation, setWaitForOperation] = useState(false);
  const prevExperiments: IExperiment[] = usePrevious(experiments);

  const doOperation = (experimentName: string | undefined, patch: JsonOperationPack | undefined) => {
    if (experimentName && patch) {
      setWaitForOperation(true);
      setTrackChanges(false);
      const draft = structuredClone(experiments);
      const i = draft.findIndex(t => t.name === experimentName);
      jsonApplyItem(draft, i, draft[i], patch);
      if (draft.length !== experiments.length) {
        // TODO: fix undo/redo of full experiment
        alert('Unable to complete undo/redo');
      }
      setExperiment(experimentName, draft[i]);
    }
  }

  const undoOperation = () => {
    const { name, undoPatch } = obtainUndo() || {};
    doOperation(name, undoPatch);
  };

  const redoOperation = () => {
    const { name, redoPatch } = obtainRedo() || {};
    doOperation(name, redoPatch);
  };

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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        event.stopPropagation();
        if (event.shiftKey) {
          redoOperation();
        } else {
          undoOperation();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <ButtonTooltip
        color="inherit"
        onClick={undoOperation}
        tooltip={"Undo"}
        disabled={undoStack.length === 0}
      >
        <Undo />
      </ButtonTooltip>
      <ButtonTooltip
        color="inherit"
        onClick={redoOperation}
        tooltip={"Redo"}
        disabled={redoStack.length === 0}
      >
        <Redo />
      </ButtonTooltip>
    </>
  )
}