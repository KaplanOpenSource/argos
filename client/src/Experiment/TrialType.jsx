import { TreeRow } from "../App/TreeRow";
import { Trial } from "./Trial";
import dayjs from "dayjs";
import { changeByName, createNewName } from "../Utils/utils";
import { IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { AddNewTrialButton } from "./AddNewTrialButton";

export const TrialType = ({ data, setData, experiment }) => {
    const trials = data?.trials || [];
    return (
        <TreeRow
            data={data}
            setData={setData}
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
        </TreeRow >
    )
}
