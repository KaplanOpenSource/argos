import { IconButton, Tooltip } from "@mui/material";
import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { experimentContext } from "../Context/ExperimentProvider";
import { useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { Download, Grid3x3, GridOn, ReadMore } from "@mui/icons-material";
import { AttributeItemList } from "./AttributeItemList";
import { SCOPE_TRIAL } from "./AttributeType";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { RealMapName } from "../constants/constants";
import { saveAs } from "file-saver";

export const Trial = ({ data, setData, experiment, trialType, children }) => {
    const { currTrial, setCurrTrial, selection } = useContext(experimentContext);

    const cloneDevices = () => {
        const devicesOnTrial = [...(data.devicesOnTrial || [])];
        const devicesOnTrialCurr = [...(currTrial.trial.devicesOnTrial || [])];
        for (const { deviceTypeName, deviceItemName } of selection) {
            if (!devicesOnTrial.find(t => t.deviceItemName === deviceItemName && t.deviceTypeName === deviceTypeName)) {
                const dev = devicesOnTrialCurr.find(t => t.deviceItemName === deviceItemName && t.deviceTypeName === deviceTypeName);
                if (dev) {
                    devicesOnTrial.push(dev);
                }
            }
        }
        setData({ ...data, devicesOnTrial });
    }

    const downloadGeojson = () => {
        const devicesOnTrial = [...(data.devicesOnTrial || [])].filter(d => {
            return d.location && d.location.coordinates && d.location.coordinates.length === 2;
        });

        const json = {
            type: 'FeatureCollection',
            features: devicesOnTrial.map(d => {
                const coordinates = d.location.coordinates.slice().reverse();
                const properties = {
                    name: d.deviceItemName,
                    type: d.deviceTypeName,
                    MapName: d.location.name || RealMapName,
                };
                for (const { name, value } of d.attributes || []) {
                    properties[name] = value;
                }
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates,
                    },
                    properties
                }
            })
        };
        const filename = `trial_${experiment.name}_${trialType.name}_${data.name}.geojson`;
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
        saveAs(blob, filename);
    }
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty
                        data={data.createdDate}
                        setData={val => setData({ ...data, createdDate: val })}
                        label="Created Date"
                    />
                    <Tooltip title="Select trial for editing" placement="top">
                        <IconButton
                            size="small"
                            onClick={() => {
                                setCurrTrial({ experimentName: experiment.name, trialTypeName: trialType.name, trialName: data.name });
                            }}
                        >
                            <GridOn color={data === currTrial.trial ? "primary" : ""} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete trial" placement="top">
                        <IconButton
                            size="small"
                            onClick={() => setData(undefined)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <ButtonTooltip
                        tooltip={'Place selected devices into this trial as are on current trial'}
                        disabled={data === currTrial.trial || selection.length === 0}
                        onClick={cloneDevices}
                    >
                        <ReadMore sx={{ rotate: '180deg' }} />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip={'Download geojson'}
                        onClick={downloadGeojson}
                    >
                        <Download />
                    </ButtonTooltip>
                    {children}
                </>
            }
        >
            {/* <Stack direction='column' alignItems="stretch">
                <TextFieldDebounceOutlined
                    sx={{ paddingLeft: 0 }}
                    label="Description"
                    value={data.description}
                    onChange={val => setData({ ...data, description: val })}
                    multiline={true}
                    rows={2}
                />
            </Stack> */}
            <AttributeItemList
                attributeTypes={trialType.attributeTypes}
                data={data}
                setData={setData}
                scope={SCOPE_TRIAL}
            />
        </TreeRow>
    )
}
