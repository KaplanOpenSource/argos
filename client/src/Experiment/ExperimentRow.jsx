import { useContext } from "react";
import { TrialType } from "./TrialType";
import { TreeRow } from "../App/TreeRow";
import { DeviceType } from "./DeviceType";
import { TreeSublist } from "../App/TreeSublist";
import { DateProperty } from "../Utils/DateProperty";
import { IconButton } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { changeByName, downloadJsonFile } from "../Utils/utils";
import { experimentContext } from "./ExperimentProvider";
import { Save } from "@mui/icons-material";

export const ExperimentRow = ({ data, setData }) => {
    const { showExperiments, currTrial, deleteExperiment } = useContext(experimentContext);
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty data={data} setData={setData}
                        label="Start Date"
                        field="startDate"
                    />
                    <DateProperty data={data} setData={setData}
                        label="End Date"
                        field="endDate"
                    />
                    <IconButton
                        onClick={() => downloadJsonFile(`experiment_${data.name}.json`, data)}
                    >
                        <DownloadIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => deleteExperiment(data.name)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='trialTypes'
                nameTemplate='New Trial Type'
                setData={setData}
            >
                {
                    ((showExperiments || !currTrial.trialType) ? (data.trialTypes || []) : [currTrial.trialType]).map(itemData => (
                        <TrialType
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, trialTypes: changeByName(data.trialTypes, itemData.name, newData) });
                            }}
                            experiment={data}
                        />
                    ))
                }
            </TreeSublist>

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='deviceTypes'
                nameTemplate='New Device Type'
                setData={setData}
            >
                {
                    (data.deviceTypes || []).map(itemData => (
                        <DeviceType
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, deviceTypes: changeByName(data.deviceTypes, itemData.name, newData) });
                            }}
                        />
                    ))
                }
            </TreeSublist>
        </TreeRow>
    )
}
