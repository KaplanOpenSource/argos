import { useContext } from "react";
import { Stack } from "@mui/material"
import { TreeRow } from "../App/TreeRow"
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { ImageOnServer } from "../IO/ImageOnServer";
import { UploadImageButton } from "../IO/UploadImageButton";
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import { experimentContext } from "../Context/ExperimentProvider";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { EditLocationAlt, EditLocationOutlined, OpenInFull } from "@mui/icons-material";

export const ImageStandalone = ({ data, setData, experiment }) => {
    const { addActionOnMap } = useContext(ActionsOnMapContext);
    const {
        currTrial,
        setShownMap,
        showImagePlacement,
        setShowImagePlacement,
    } = useContext(experimentContext);

    const isBeingEdit = showImagePlacement && currTrial.shownMapName === data.name && currTrial.experimentName === experiment.name;

    const fitBoundsToImage = () => {
        addActionOnMap((mapObject) => {
            mapObject.fitBounds([[data.ytop, data.xleft], [data.ybottom, data.xright]]);
        });
    }

    const switchToMap = () => {
        setShownMap(data.name);
        setTimeout(() => {
            fitBoundsToImage();
        }, 100);
    }

    return (
        <TreeRow
            data={data}
            setData={setData}
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
                        tooltip={currTrial.experiment ? "Switch to this image" : "First choose a trial before switching to this image"}
                        onClick={() => switchToMap()}
                        disabled={!currTrial.experiment}
                    >
                        <MapIcon />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip="Fit image to screen"
                        onClick={() => fitBoundsToImage()}
                        disabled={(data || {}).ytop === undefined}
                    >
                        <OpenInFull />
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