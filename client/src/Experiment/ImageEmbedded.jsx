import { TreeRow } from "../App/TreeRow"
import DeleteIcon from '@mui/icons-material/Delete';
import { UploadImageIcon } from "../IO/UploadImageIcon";
import { ImageOnServer } from "../IO/ImageOnServer";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { EditLocationAlt, EditLocationOutlined, OpenInFull } from "@mui/icons-material";
import { experimentContext } from "../Context/ExperimentProvider";
import { useContext } from "react";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { Stack } from "@mui/material";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";

export const ImageEmbedded = ({ data, setData, experiment }) => {
    const { addActionOnMap, mapBounds } = useContext(ActionsOnMapContext);
    const {
        currTrial,
        showImagePlacement,
        setShowImagePlacement,
    } = useContext(experimentContext);

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
                    <UploadImageIcon
                        imageName={data.name}
                        experimentName={experiment.name}
                        onChangeFile={(filename, height, width) => {
                            console.log(mapBounds);
                            if (!mapBounds) {
                                alert('unknown map bounds');
                                return;
                            }
                            const lngsize = (mapBounds.getEast() - mapBounds.getWest()) / 2;
                            const latsize = width > 0 ? lngsize / width * height : 0;
                            const lngwest = mapBounds.getCenter().lng + lngsize / 2;
                            const lngeast = mapBounds.getCenter().lng - lngsize / 2;
                            const latnorth = mapBounds.getCenter().lat + latsize / 2;
                            const latsouth = mapBounds.getCenter().lat - latsize / 2;
                            setData({
                                ...data,
                                filename,
                                height,
                                width,
                                latnorth,
                                lngwest,
                                latsouth,
                                lngeast,
                            });
                        }}
                    />
                    <ButtonTooltip
                        tooltip="Fit image to screen"
                        onClick={() => addActionOnMap((mapObject) => {
                            mapObject.fitBounds([[data.latnorth, data.lngwest], [data.latsouth, data.lngeast]]);
                        })}
                        disabled={(data || {}).latnorth === undefined}
                    >
                        <OpenInFull />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip="Edit image placement"
                        onClick={() => setShowImagePlacement(!showImagePlacement)}
                    >
                        {(showImagePlacement && currTrial.experimentName === experiment.name)
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
            <Stack direction={'row'}>
                <TextFieldDebounceOutlined
                    label="Lng West"
                    value={data.lngwest}
                    onChange={val => setData({ ...data, lngwest: val })}
                />
                <TextFieldDebounceOutlined
                    label="Lat North"
                    value={data.latnorth}
                    onChange={val => setData({ ...data, latnorth: val })}
                />
            </Stack>
            <Stack direction={'row'}>
                <TextFieldDebounceOutlined
                    label="Lng East"
                    value={data.lngeast}
                    onChange={val => setData({ ...data, lngeast: val })}
                />
                <TextFieldDebounceOutlined
                    label="Lat South"
                    value={data.latsouth}
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