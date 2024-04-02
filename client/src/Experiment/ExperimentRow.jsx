import { useContext } from "react";
import { TrialType } from "./TrialType";
import { TreeRow } from "../App/TreeRow";
import { DeviceType } from "./DeviceType";
import { TreeSublist } from "../App/TreeSublist";
import { DateProperty } from "../Utils/DateProperty";
import { IconButton } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import { changeByName } from "../Utils/utils";
import { experimentContext } from "../Context/ExperimentProvider";
import { ImageStandalone } from "./ImageStandalone";
import { ImageEmbedded } from "./ImageEmbedded";
import { downloadJsonFile } from "./DownloadJsonFile";

export const ExperimentRow = ({ data, setData, children }) => {
    const { deleteExperiment, setShownMap } = useContext(experimentContext);
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty
                        data={data.startDate}
                        setData={val => setData({ ...data, startDate: val })}
                        label="Start Date"
                    />
                    <DateProperty
                        data={data.endDate}
                        setData={val => setData({ ...data, endDate: val })}
                        label="End Date"
                    />
                    <IconButton
                        size="small"
                        onClick={() => downloadJsonFile(data)}
                    >
                        <DownloadIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => deleteExperiment(data.name)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    {children}
                </>
            }
        >

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='trialTypes'
                nameTemplate='New Trial Type'
                setData={setData}
                newDataCreator={() => {
                    return {
                        attributeTypes: [
                            {
                                "type": "Date",
                                "name": "TrialStart",
                            },
                            {
                                "type": "Date",
                                "name": "TrialEnd",
                            },
                            {
                                "type": "Boolean",
                                "name": "StoreDataPerDevice",
                                "defaultValue": false
                            },
                        ]
                    }
                }}
            >
                {
                    (data.trialTypes || []).map(itemData => (
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

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='imageEmbedded'
                nameTemplate='New Embedded Image'
                setData={setData}
                components={
                    <IconButton
                        onClick={() => setShownMap(undefined)}
                    >
                        <PublicIcon />
                    </IconButton>
                }
            >
                {
                    (data.imageEmbedded || []).map(itemData => (
                        <ImageEmbedded
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, imageEmbedded: changeByName(data.imageEmbedded, itemData.name, newData) });
                            }}
                        />
                    ))
                }
            </TreeSublist>

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='imageStandalone'
                nameTemplate='New Standalone Image'
                setData={setData}
            >
                {
                    (data.imageStandalone || []).map(itemData => (
                        <ImageStandalone
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, imageStandalone: changeByName(data.imageStandalone, itemData.name, newData) });
                            }}
                            experiment={data}
                        />
                    ))
                }
            </TreeSublist>
        </TreeRow>
    )
}
