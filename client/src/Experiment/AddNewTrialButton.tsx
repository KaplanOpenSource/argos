import { Add } from "@mui/icons-material";
import dayjs from "dayjs";
import { assignUuids } from "../Context/TrackUuidUtils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { createNewName } from "../Utils/utils";
import { IExperiment, ITrialType } from "../types/types";

export const AddNewTrialButton = ({
  experiment,
  trialType,
  setTrialType,
}: {
  experiment: IExperiment,
  trialType: ITrialType,
  setTrialType: (val: ITrialType) => void,
}) => {
  return (
    <ButtonTooltip
      tooltip="Add new trial"
      onClick={e => {
        const name = createNewName(experiment.trialTypes?.flatMap(t => t.trials || []) || [], 'New Trial');
        const createdDate = dayjs().startOf('day').add(12, 'hours').toISOString();
        const newTrial = assignUuids({ name, createdDate });
        setTrialType({ ...trialType, trials: [...(trialType.trials || []), newTrial] });
      }}
    >
      <Add />
    </ButtonTooltip>
  )
}