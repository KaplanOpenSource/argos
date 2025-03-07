import { useContext } from "react";
import { Stack } from "@mui/material"
import { TreeRow } from "../App/TreeRow"
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { ImageOnServer } from "../IO/ImageOnServer";
import { UploadImageButton } from "../IO/UploadImageButton";
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import { experimentContext } from "../Context/ExperimentProvider";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { EditLocationAlt, EditLocationOutlined } from "@mui/icons-material";
import { useShownMap } from "../Context/useShownMap";

export const ImageStandalone = ({ data, setData, experiment }) => {
    const {
        currTrial,
        setExperiment,
        setShownMap,
        showImagePlacement,
        setShowImagePlacement,
    } = useContext(experimentContext);
    const { switchToMap } = useShownMap({});

    const isShown = currTrial.shownMapName === data.name && currTrial.experimentName === experiment.name;
    const isBeingEdit = showImagePlacement && isShown;

    const setDataCheckName = (newData) => {
        const newName = newData?.name;
        const oldName = data?.name;
        if (newName === oldName) {
            setData(newData);
        } else {
            console.log('image name changed from', data?.name, 'to', newData?.name);
            const exp = structuredClone(currTrial?.experiment);
            for (const trialType of exp?.trialTypes || []) {
                for (const trial of trialType?.trials || []) {
                    for (const d of trial?.devicesOnTrial || []) {
                        if (d.location.name === oldName) {
                            d.location.name = newName;
                        }
                    }
                }
            }
            for (const s of exp?.imageStandalone || []) {
                if (s?.name === oldName) {
                    s.name = newName;
                }
            }
            setExperiment(exp.name, exp);
            if (isShown) {
                setShownMap(newName)
            }
        }
    }

    return (
        <TreeRow
            data={data}
            setData={setDataCheckName}
            components={
                <>
                    <ButtonTooltip
                        tooltip="Delete image"
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </ButtonTooltip>
                    <UploadImageButton
                        imageName={data.name}
                        experimentName={experiment.name}
                        onChangeFile={(filename, height, width) => setData({
                            ...data,
                            filename,
                            height,
                            width,
                            xleft: 0,
                            ybottom: 0,
                            xright: width,
                            ytop: height,
                        })}
                    />
                    <ButtonTooltip
                        tooltip={currTrial.experiment ? "Switch to this image" : "First choose an experiment before switching to this image"}
                        onClick={() => switchToMap(data.name)}
                        disabled={!currTrial.experiment || (data || {}).ytop === undefined}
                    >
                        <MapIcon />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip="Edit image placement"
                        onClick={() => setShowImagePlacement(!showImagePlacement)}
                    >
                        {isBeingEdit
                            ? <EditLocationAlt />
                            : <EditLocationOutlined />
                        }
                    </ButtonTooltip>
                    <ImageOnServer
                        showSize={false}
                        maxHeight={40}
                        data={data}
                        experiment={experiment}
                        style={{ borderRadius: 10 }}
                    />
                </>
            }
        >
            <Stack direction={'column'}>
                <Stack direction={'row'}>
                    <TextFieldDebounceOutlined
                        label="X Left"
                        value={data.xleft}
                        onChange={val => setData({ ...data, xleft: val })}
                    />
                    <TextFieldDebounceOutlined
                        label="Y Top"
                        value={data.ytop}
                        onChange={val => setData({ ...data, ytop: val })}
                    />
                </Stack>
                <Stack direction={'row'}>
                    <TextFieldDebounceOutlined
                        label="X Right"
                        value={data.xright}
                        onChange={val => setData({ ...data, xright: val })}
                    />
                    <TextFieldDebounceOutlined
                        label="Y Bottom"
                        value={data.ybottom}
                        onChange={val => setData({ ...data, ybottom: val })}
                    />
                </Stack>
                <ImageOnServer
                    data={data}
                    experiment={experiment}
                />
            </Stack>
        </TreeRow>
    )
}