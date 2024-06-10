import { useContext } from "react";
import { TreeRow } from "../App/TreeRow";
import { TreeSublist } from "../App/TreeSublist";
import { DateProperty } from "../Utils/DateProperty";
import { IconButton, Stack } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import { changeByName } from "../Utils/utils";
import { experimentContext } from "../Context/ExperimentProvider";
import { ImageStandalone } from "./ImageStandalone";
import { ImageEmbedded } from "./ImageEmbedded";
import { downloadJsonFile } from "../IO/DownloadJsonFile";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { DeviceTypesList } from "./DeviceTypesList";
import { TrialTypesList } from "./TrialTypesList";
import { SCOPE_CONSTANT } from "./AttributeType";

export const ExperimentRow = ({ data, setData, children }) => {
    const { deleteExperiment, setShownMap } = useContext(experimentContext);
    return (
        <TreeRow
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
                    <ButtonTooltip
                        tooltip={"Download experiment"}
                        onClick={() => downloadJsonFile(data)}
                    >
                        <DownloadIcon />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip={"Delete experiment"}
                        onClick={() => deleteExperiment(data.name)}
                    >
                        <DeleteIcon />
                    </ButtonTooltip>
                    {children}
                </>
            }
        >
            <Stack direction='column' alignItems="stretch" sx={{ paddingRight: '5px' }}>
                <TextFieldDebounceOutlined
                    label="Description"
                    value={data.description}
                    onChange={val => setData({ ...data, description: val })}
                    multiline={true}
                    rows={2}
                />
            </Stack>
            <TreeSublist
                parentKey={data.trackUuid}
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
                        ]
                    }
                }}
            >
                <TrialTypesList
                    data={data}
                    setData={setData}
                />
            </TreeSublist>

            <TreeSublist
                parentKey={data.trackUuid}
                data={data}
                fieldName='deviceTypes'
                nameTemplate='New Device Type'
                setData={setData}
                newDataCreator={() => {
                    return {
                        attributeTypes: [
                            {
                                "type": "Boolean",
                                "name": "StoreDataPerDevice",
                                "defaultValue": false,
                                "scope": SCOPE_CONSTANT
                            },
                        ]
                    }
                }}
            >
                <DeviceTypesList
                    data={data}
                    setData={setData}
                />
            </TreeSublist>

            <TreeSublist
                parentKey={data.trackUuid}
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
                            experiment={data}
                        />
                    ))
                }
            </TreeSublist>

            <TreeSublist
                parentKey={data.trackUuid}
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
