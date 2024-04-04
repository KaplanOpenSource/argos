import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { baseUrl } from "../Context/FetchExperiment";

export const downloadJsonFile = async (experiment) => {
    const zip = JSZip();
    zip.file(`${experiment.name}.json`, JSON.stringify(experiment));
    for (const img of (experiment.imageStandalone || [])) {
        if (img.filename) {
            const src = `${baseUrl}/uploads/${experiment.name}/${img.filename}`;
            const resp = await fetch(src);
            const image = await resp.blob();
            const ext = img.filename.split('.').pop();
            const filename = `images/${img.name}.${ext}`
            zip.file(filename, image, { binary: true });
        }
    }
    // expToDownload.maps.forEach(img => {
    //     zip.file(`images/${img.imageName}`, img.imageUrl, {
    //         binary: true
    //     });
    // });

    // logImages.forEach(array => {
    //     array.forEach(img => {
    //         zip.file(`images/${img.imageName}`, img.imageUrl, {
    //             binary: true
    //         });
    //     });
    // })

    const zipblob = await zip.generateAsync({ type: "blob" });
    saveAs(zipblob, `experiment_${experiment.name}.zip`);
}

