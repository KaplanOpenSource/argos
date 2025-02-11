import { Download } from "@mui/icons-material"
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import JSZip from "jszip";
import { cleanUuids } from "../Context/TrackUuidUtils";
import { shapesToGeoJSON } from "./ShapesToGeoJson";
import { saveAs } from 'file-saver';
import { useDownloadImage } from "./useDownloadImage";
// import { convertFontAwesomeToBlob } from "../Utils/convertFontAwesomeToBlob";

export const DownloadExperimentButton = ({ experiment }) => {
    const { downloadImageAsBlob } = useDownloadImage();

    const downloadExperimentAsZip = async (experiment) => {
        const zip = JSZip();
        const cleaned = cleanUuids(experiment);
        zip.file(`data.json`, JSON.stringify(cleaned));
        const images = (experiment.imageStandalone || []).concat((experiment.imageEmbedded || []));
        for (const img of images) {
            if (img.filename) {
                const image = await downloadImageAsBlob(experiment.name, img.filename);
                const ext = img.filename.split('.').pop();
                const filename = `images/${img.name}.${ext}`;
                zip.file(filename, image, { binary: true });
            }
        }

        // for (const deviceType of experiment.deviceTypes || []) {
        //     if (deviceType?.icon) {
        //         const blob = await convertFontAwesomeToBlob(deviceType?.icon);
        //         const filename = `icons/${deviceType?.icon}.png`;
        //         zip.file(filename, blob, { binary: true });
        //     }
        // }

        if (experiment.shapes) {
            const shapesGeoJson = shapesToGeoJSON(experiment.shapes);
            zip.file(`shapes.geojson`, JSON.stringify(shapesGeoJson));
        }

        const zipblob = await zip.generateAsync({ type: "blob" });
        saveAs(zipblob, `experiment_${experiment.name}.zip`);
    }

    return (
        <ButtonTooltip
            tooltip={"Download experiment"}
            onClick={() => downloadExperimentAsZip(experiment)}
        >
            <Download />
        </ButtonTooltip>
    )
}