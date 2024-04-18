import { TreeRow } from "../App/TreeRow"
import DeleteIcon from '@mui/icons-material/Delete';
import { UploadImageIcon } from "./UploadImageIcon";
import { ImageOnServer } from "./ImageOnServer";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { EditLocationAlt, EditLocationOutlined, OpenInFull } from "@mui/icons-material";
import { experimentContext } from "../Context/ExperimentProvider";
import { useContext } from "react";

export const ImageEmbedded = ({ data, setData, experiment }) => {
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
                            // xleft: 0,
                            // ybottom: 0,
                            // xright: width,
                            // ytop: height,
                        })}
                    />
                    <ButtonTooltip
                        tooltip="Fit image to screen"
                        onClick={() => addActionOnMap((mapObject) => mapObject.fitBounds([[data.height, 0], [0, data.width]]))}
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
            <ImageOnServer
                data={data}
                experiment={experiment}
            />
        </TreeRow>
    )
}