import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { changeByName, createNewName } from "../Utils/utils";
import { AddNewTrialButton } from "./AddNewTrialButton";
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";
import { Trial } from "./Trial";

export const TrialType = ({ data, setData, experiment }) => {
  const trials = data?.trials || [];
  return (
    <TreeRowOnChosen
      data={data}
      components={
        <>
          <Tooltip title="Delete trial type" placement="top">
            <IconButton
              size="small"
              onClick={() => setData(undefined)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <AddNewTrialButton
            trialType={data}
            setTrialType={setData}
          />
          <AttributeTypesDialogButton
            data={data}
            setData={setData}
            isOfDevice={false}
            containers={{ experiment, trialType: data }}
          />
          <Typography>
            {trials.length} Trials
          </Typography>
        </>
      }
    >
      {
        trials.map(itemData => (
          <Trial
            key={itemData.name}
            data={itemData}
            setData={newData => {
              setData({ ...data, trials: changeByName(data.trials, itemData.name, newData) });
            }}
            experiment={experiment}
            trialType={data}
          >
            <ButtonTooltip
              tooltip="Clone trial"
              onClick={e => {
                const cloned = structuredClone(itemData);
                cloned.name = createNewName(data.trials, itemData.name + " cloned");
                cloned.createdDate = dayjs().startOf('day').add(12, 'hours').toISOString();
                setData({ ...data, trials: [...(data.trials || []), cloned] });
              }}
            >
              <ContentCopyIcon />
            </ButtonTooltip>
          </Trial>
        ))
      }
    </TreeRowOnChosen >
  )
}
