import { IconButton, Stack, Typography } from "@mui/material"
import { TreeRow } from "../App/TreeRow"
import DeleteIcon from '@mui/icons-material/Delete';
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { UploadImageIcon } from "./UploadImageIcon";
import { baseUrl } from "../Context/FetchExperiment";

export const ImageStandalone = ({ data, setData }) => {
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
                        onChangeFile={(path, height, width) => setData({ ...data, path, height, width })}
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
                {
                    !data.path ? null :
                        <>
                            <Typography variant="body2">Size: {data.width} x {data.height}</Typography>
                            {data.height > data.width
                                ? <img
                                    src={baseUrl + data.path}
                                    height={Math.min(data.height, 500)}
                                />
                                : <img
                                    src={baseUrl + data.path}
                                    width={Math.min(data.width, 500)}
                                />
                            }
                        </>
                }
            </Stack>
        </TreeRow>
    )
}