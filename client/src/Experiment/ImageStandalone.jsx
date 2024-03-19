import { useContext } from "react";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { TreeRow } from "../App/TreeRow"
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { baseUrl } from "../Context/FetchExperiment";
import { ImageOnServer } from "./ImageOnServer";
import { UploadImageIcon } from "./UploadImageIcon";
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import { experimentContext } from "../Context/ExperimentProvider";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";

export const ImageStandalone = ({ data, setData, experiment }) => {
    const { addActionOnMap } = useContext(ActionsOnMapContext);
    const {
        currTrial,
        setShownMap,
        showImagePlacement,
        setShowImagePlacement,
    } = useContext(experimentContext);
    console.log(data)
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <IconButton
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <UploadImageIcon
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
                    <Tooltip
                        title="Switch to this image"
                    >
                        <IconButton
                            onClick={() => setShownMap(data.name)}
                        >
                            <MapIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title="Fit image to screen"
                    >
                        <IconButton
                            onClick={() => addActionOnMap((mapObject) => mapObject.fitBounds([[data.height, 0], [0, data.width]]))}
                        >
                            <OpenInFullIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title="Edit image placement"
                    >
                        <IconButton
                            onClick={() => setShowImagePlacement(!showImagePlacement)}
                        >
                            {(showImagePlacement && currTrial.shownMapName === data.name && currTrial.experimentName === experiment.name)
                                ? <EditLocationAltIcon />
                                : <EditLocationOutlinedIcon />
                            }
                        </IconButton>
                    </Tooltip>
                </>
            }
        >
            <Stack direction={'column'}>
                <Stack direction={'row'}>
                    <TextFieldDebounceOutlined
                        label="X Left"
                        value={data.xleft || ""}
                        onChange={val => setData({ ...data, xleft: val })}
                    />
                    <TextFieldDebounceOutlined
                        label="Y Top"
                        value={data.ytop || ""}
                        onChange={val => setData({ ...data, ytop: val })}
                    />
                </Stack>
                <Stack direction={'row'}>
                    <TextFieldDebounceOutlined
                        label="X Right"
                        value={data.xright || ""}
                        onChange={val => setData({ ...data, xright: val })}
                    />
                    <TextFieldDebounceOutlined
                        label="Y Bottom"
                        value={data.ybottom || ""}
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