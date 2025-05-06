import { Add } from "@mui/icons-material";
import dayjs from "dayjs";
import { assignUuids } from "../Context/TrackUuidUtils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { createNewName } from "../Utils/utils";

export const AddNewTrialButton = ({ trialType, setTrialType }) => {
  return (
    <ButtonTooltip
      tooltip="Add new trial"
      onClick={e => {
        e.stopPropagation();
        const name = createNewName(trialType.trials, 'New Trial');
        const createdDate = dayjs().startOf('day').add(12, 'hours').toISOString();
        const newTrial = assignUuids({ name, createdDate });
        setTrialType({ ...trialType, trials: [...(trialType.trials || []), newTrial] });
      }}
    >
      <Add />
    </ButtonTooltip>
  )
}