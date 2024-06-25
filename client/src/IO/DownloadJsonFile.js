import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { cleanUuids } from "../Context/TrackUuidUtils";
import { baseUrl } from "../App/TokenContext";

export const downloadJsonFile = async (experiment) => {
    const zip = JSZip();
    const cleaned = cleanUuids(experiment);
    zip.file(`data.json`, JSON.stringify(cleaned));
    const images = (experiment.imageStandalone || []).concat((experiment.imageEmbedded || []));
    for (const img of images) {
        if (img.filename) {
            const src = `${baseUrl}/uploads/${experiment.name}/${img.filename}`;
            const resp = await fetch(src);
            const image = await resp.blob();
            const ext = img.filename.split('.').pop();
            const filename = `images/${img.name}.${ext}`
            zip.file(filename, image, { binary: true });
        }
    }

    const zipblob = await zip.generateAsync({ type: "blob" });
    saveAs(zipblob, `experiment_${experiment.name}.zip`);
}

