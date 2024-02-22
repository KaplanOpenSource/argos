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

export const ExperimentRow = ({ data, setData, path }) => {
    const { showExperiments, currTrial, saveExperiment, deleteExperiment, changeExperiment } = useContext(experimentContext);
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty
                        label="Start Date"
                        data={data["startDate"]}
                        setData={(val) => changeExperiment({ op: "replace", path: path + "/startDate", value: val })}
                    />
                    <DateProperty
                        label="End Date"
                        data={data["endDate"]}
                        setData={(val) => changeExperiment({ op: "replace", path: path + "/endDate", value: val })}
                    />
                    <IconButton
                        onClick={() => downloadJsonFile(`experiment_${data.name}.json`, data)}
                    >
                        <DownloadIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => saveExperiment(data.name)}
                    >
                        <Save />
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
                    (data.deviceTypes || []).map((itemData, index) => (
                        <DeviceType
                            key={itemData.name}
                            data={itemData}
                            path={`${path}/deviceTypes/${index}`}
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
