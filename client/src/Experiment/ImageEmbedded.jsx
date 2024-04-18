import { TreeRow } from "../App/TreeRow"
import DeleteIcon from '@mui/icons-material/Delete';
import { UploadImageIcon } from "./UploadImageIcon";
import { ImageOnServer } from "./ImageOnServer";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { EditLocationAlt, EditLocationOutlined, OpenInFull } from "@mui/icons-material";
import { experimentContext } from "../Context/ExperimentProvider";
import { useContext } from "react";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { Stack } from "@mui/material";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";

export const ImageEmbedded = ({ data, setData, experiment }) => {
    const { addActionOnMap } = useContext(ActionsOnMapContext);
    const {
        currTrial,
        setShownMap,
        showImagePlacement,
        setShowImagePlacement,
    } = useContext(experimentContext);
    return (
        <TreeRow
            key={data.name}
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
                    <UploadImageIcon
                        imageName={data.name}
                        experimentName={experiment.name}
                        onChangeFile={(filename, height, width) => setData({
                            ...data,
                            filename,
                            height,
                            width,
                            latnorth: 32.1,
                            lngwest: 34.7,
                            latsouth: 32.07,
                            lngeast: 34.8,
                        })}
                    />
                    <ButtonTooltip
                        tooltip="Fit image to screen"
                        onClick={() => addActionOnMap((mapObject) => mapObject.fitBounds([[data.latnorth, data.lngwest], [data.latsouth, data.lngeast]]))}
                    >
                        <OpenInFull />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip="Edit image placement"
                        onClick={() => setShowImagePlacement(!showImagePlacement)}
                    >
                        {(showImagePlacement && currTrial.shownMapName === data.name && currTrial.experimentName === experiment.name)
                            ? <EditLocationAlt />
                            : <EditLocationOutlined />
                        }
                    </ButtonTooltip>
                </>
            }
        >
            <Stack direction={'row'}>
                <TextFieldDebounceOutlined
                    label="Lng West"
                    value={data.lngwest || ""}
                    onChange={val => setData({ ...data, lngwest: val })}
                />
                <TextFieldDebounceOutlined
                    label="Lat North"
                    value={data.latnorth || ""}
                    onChange={val => setData({ ...data, latnorth: val })}
                />
            </Stack>
            <Stack direction={'row'}>
                <TextFieldDebounceOutlined
                    label="Lng East"
                    value={data.lngeast || ""}
                    onChange={val => setData({ ...data, lngeast: val })}
                />
                <TextFieldDebounceOutlined
                    label="Lat South"
                    value={data.latsouth || ""}
                    onChange={val => setData({ ...data, latsouth: val })}
                />
            </Stack>
            <ImageOnServer
                data={data}
                experiment={experiment}
            />
        </TreeRow>
    )
}