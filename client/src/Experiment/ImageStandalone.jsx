import { IconButton, Stack, Typography } from "@mui/material"
import { TreeRow } from "../App/TreeRow"
import DeleteIcon from '@mui/icons-material/Delete';
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { UploadImageIcon } from "./UploadImageIcon";
import { baseUrl } from "../Context/FetchExperiment";
import { ImageOnServer } from "./ImageOnServer";
import MapIcon from '@mui/icons-material/Map';
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";

export const ImageStandalone = ({ data, setData }) => {
    const { setShownMap } = useContext(experimentContext);
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
                        onChangeFile={(path, height, width) => setData({
                            ...data, path, height, width,
                            xleft: 0, ybottom: 0,
                            xright: width, ytop: height,
                        })}
                    />
                    <IconButton
                        onClick={() => setShownMap(data.name)}
                    >
                        <MapIcon />
                    </IconButton>
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
                />
            </Stack>
        </TreeRow>
    )
}