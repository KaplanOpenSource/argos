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
import { useTrialGeoJson } from "../IO/TrialGeoJson";

export const Trial = ({ data, setData, experiment, trialType, children }) => {
    const { currTrial, setCurrTrial, selection } = useContext(experimentContext);
    const { downloadGeojson } = useTrialGeoJson();

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

    return (
        <TreeRow
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
                        onClick={() => downloadGeojson(data, experiment, trialType)}
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
