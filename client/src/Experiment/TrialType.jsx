import { useContext } from "react";
import { TreeRow } from "../App/TreeRow";
import { Trial } from "./Trial";
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";
import dayjs from "dayjs";
import { experimentContext } from "../Context/ExperimentProvider";
import { changeByName, createNewName } from "../Utils/utils";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";

export const TrialType = ({ data, setData, experiment }) => {
    const { showExperiments, currTrial } = useContext(experimentContext);
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <Tooltip title="Delete trial type" placement="top">
                        <IconButton
                            onClick={() => setData(undefined)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add new trial" placement="top">
                        <IconButton
                            onClick={e => {
                                e.stopPropagation();
                                const name = createNewName(data.trials, 'New Trial');
                                const createdDate = dayjs().startOf('day');
                                setData({ ...data, trials: [...(data.trials || []), { name, createdDate }] });
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <AttributeTypesDialogButton
                        data={data}
                        setData={setData}
                    />
                </>
            }
        >
            {
                ((showExperiments || !currTrial.trial) ? (data.trials || []) : [currTrial.trial]).map(itemData => (
                    <Trial
                        key={itemData.name}
                        data={itemData}
                        setData={newData => {
                            setData({ ...data, trials: changeByName(data.trials, itemData.name, newData) });
                        }}
                        experiment={experiment}
                        trialType={data}
                    />
                ))
            }
        </TreeRow>
    )
}
