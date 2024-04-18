import { IconButton } from "@mui/material"
import { TreeRow } from "../App/TreeRow"
import DeleteIcon from '@mui/icons-material/Delete';
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";
import { UploadImageIcon } from "./UploadImageIcon";
import { ImageOnServer } from "./ImageOnServer";

export const ImageEmbedded = ({ data, setData, experiment }) => {
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
                            // xleft: 0,
                            // ybottom: 0,
                            // xright: width,
                            // ytop: height,
                        })}
                    />
                </>
            }
        >
            <ImageOnServer
                data={data}
                experiment={experiment}
            />
        </TreeRow>
    )
}