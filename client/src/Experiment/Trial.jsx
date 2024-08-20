import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { experimentContext } from "../Context/ExperimentProvider";
import { useContext, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { Download, GridOn, ReadMore, Upload } from "@mui/icons-material";
import { AttributeItemList } from "./AttributeItemList";
import { SCOPE_TRIAL } from "./AttributeType";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { useTrialGeoJson } from "../IO/TrialGeoJson";
import { ButtonMenu } from "../Utils/ButtonMenu";
import { UploadButton } from "../IO/UploadButton";
import { CoordsSpan } from "./CoordsSpan";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import { RealMapName } from "../constants/constants";

export const Trial = ({ data, setData, experiment, trialType, children }) => {
    const { currTrial, setCurrTrial, selection, setShownMap } = useContext(experimentContext);
    const { downloadGeojson, downloadZipCsv, uploadTrial } = useTrialGeoJson();
    const { addActionOnMap } = useContext(ActionsOnMapContext);

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

    useEffect(() => {
        if (currTrial.trial) {
            const span = new CoordsSpan().fromTrial(currTrial.trial);
            const standalone = span.getFirstStandalone()
            if (currTrial.shownMapName !== standalone) {
                setShownMap(standalone);
            }
            addActionOnMap((mapObject) => {
                span.fitBounds(mapObject, standalone ? standalone : RealMapName);
            });
        }
    }, [currTrial?.trialName + "::" + currTrial?.trialTypeName + "::" + currTrial?.experiment]);

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
                    <ButtonTooltip
                        tooltip="Select trial for editing"
                        onClick={() => {
                            setCurrTrial({ experimentName: experiment.name, trialTypeName: trialType.name, trialName: data.name });
                        }}
                    >
                        <GridOn color={data === currTrial.trial ? "primary" : ""} />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip="Delete trial"
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip={'Place selected devices into this trial as are on current trial'}
                        disabled={data === currTrial.trial || selection.length === 0}
                        onClick={cloneDevices}
                    >
                        <ReadMore sx={{ rotate: '180deg' }} />
                    </ButtonTooltip>
                    <ButtonMenu
                        tooltip={'Download devices'}
                        menuItems={[
                            { name: 'Download as GeoJson', action: () => downloadGeojson(experiment, trialType, data) },
                            { name: 'Download as Zip of CSVs', action: () => downloadZipCsv(experiment, trialType, data) },
                        ]}
                    >
                        <Download />
                    </ButtonMenu>
                    <UploadButton
                        tooltip={'Upload devices as geojson, csv, zip of csvs'}
                        uploadFunc={file => uploadTrial(file, data, experiment, (newData) => setData(newData))}
                    >
                        <Upload />
                    </UploadButton>
                    {children}
                </>
            }
        >
            <AttributeItemList
                attributeTypes={trialType.attributeTypes}
                data={data}
                setData={setData}
                scope={SCOPE_TRIAL}
            />
        </TreeRow>
    )
}
