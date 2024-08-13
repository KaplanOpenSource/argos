import { TreeRow } from "../App/TreeRow";
import { Trial } from "./Trial";
import dayjs from "dayjs";
import { changeByName, createNewName } from "../Utils/utils";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";
import { assignUuids } from "../Context/TrackUuidUtils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";

export const TrialType = ({ data, setData, experiment }) => {
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
                    <Tooltip title="Add new trial" placement="top">
                        <IconButton
                            size="small"
                            onClick={e => {
                                e.stopPropagation();
                                const name = createNewName(data.trials, 'New Trial');
                                const createdDate = dayjs().startOf('day');
                                const newTrial = assignUuids({ name, createdDate });
                                setData({ ...data, trials: [...(data.trials || []), newTrial] });
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <AttributeTypesDialogButton
                        data={data}
                        setData={setData}
                        isOfDevice={false}
                    />
                </>
            }
        >
            {
                (data.trials || []).map(itemData => (
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
                                cloned.createdDate = dayjs().startOf('day');
                                setData({ ...data, trials: [...(data.trials || []), cloned] });
                            }}
                        >
                            <ContentCopyIcon />
                        </ButtonTooltip>
                    </Trial>
                ))
            }
        </TreeRow>
    )
}
