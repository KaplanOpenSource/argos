import { DateProperty } from "../Property/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useContext, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { ArrowDropDown, ArrowDropUp, Download, Edit, ReadMore } from "@mui/icons-material";
import { AttributeItemList } from "./AttributeItemList";
import { ScopeEnum } from "../types/types";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { useTrialGeoJson } from "../IO/TrialGeoJson";
import { ButtonMenu } from "../Utils/ButtonMenu";
import { CoordsSpan } from "./CoordsSpan";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import { RealMapName } from "../constants/constants";
import { sum } from "lodash";
import { Stack, Typography } from "@mui/material";
import { UploadDevicesButton } from "../IO/UploadDevices/UploadDevicesButton";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { useChosenTrial } from "../Context/useChosenTrial";
import { useExperiments } from "../Context/useExperiments";
import { arraySwapItems } from "../Utils/utils";

export const Trial = ({ data, setData, experiment, trialType, children }) => {
    const { selection } = useDeviceSeletion();
    const { currTrial, setCurrTrial } = useExperimentProvider();
    const { chooseShownMap } = useChosenTrial();
    const { downloadGeojson, downloadZipCsv } = useTrialGeoJson();
    const { addActionOnMap } = useContext(ActionsOnMapContext);
    const { setExperiment } = useExperiments();

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
                chooseShownMap(standalone);
            }
            addActionOnMap((mapObject) => {
                span.fitBounds(mapObject, standalone ? standalone : RealMapName);
            });
        }
    }, [currTrial?.trialName + "::" + currTrial?.trialTypeName + "::" + currTrial?.experiment]);

    const totalDevices = sum((experiment?.deviceTypes || []).map(x => (x?.devices || []).length));
    const placedDevices = (data.devicesOnTrial || []).length;

    return (
        <TreeRow
            data={data}
            setData={setData}
            boldName={data === currTrial?.trial}
            validateName={(name) => !trialType?.trials?.find(tt => tt.name === name) ? '' : 'Duplicate name'}
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
                        <Edit color={data === currTrial?.trial ? "primary" : ""} />
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
                    <UploadDevicesButton
                        trial={data}
                        trialType={trialType}
                        experiment={experiment}
                        setTrialData={setData}
                    />
                    <Stack direction='column' spacing={-1.5}>
                        <ButtonTooltip
                            tooltip='Swap places with higher trial'
                            sx={{ paddingBottom: 0 }}
                            onClick={() => {
                                const exp = structuredClone(experiment);
                                const tt = exp.trialTypes.find(x => x.name === trialType.name);
                                const i = tt.trials.findIndex(x => x.name === data.name);
                                if (i > 0) {
                                    arraySwapItems(tt.trials, i - 1, i);
                                    setExperiment(exp.name, exp);
                                }
                            }}
                        >
                            <ArrowDropUp />
                        </ButtonTooltip>
                        <ButtonTooltip
                            tooltip='Swap places with lower trial'
                            sx={{ paddingTop: 0 }}
                            onClick={() => {
                                const exp = structuredClone(experiment);
                                const tt = exp.trialTypes.find(x => x.name === trialType.name);
                                const i = tt.trials.findIndex(x => x.name === data.name);
                                if (i < tt.trials.length - 1) {
                                    arraySwapItems(tt.trials, i, i + 1);
                                    setExperiment(exp.name, exp);
                                }
                            }}
                        >
                            <ArrowDropDown />
                        </ButtonTooltip>
                    </Stack>
                    {children}
                    <Typography>
                        {placedDevices}/{totalDevices}
                    </Typography>
                </>
            }
        >
            <AttributeItemList
                attributeTypes={trialType.attributeTypes}
                data={data}
                setData={setData}
                scope={ScopeEnum.SCOPE_TRIAL}
            />
        </TreeRow>
    )
}
