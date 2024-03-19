import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { baseUrl } from "../Context/FetchExperiment";

export const downloadJsonFile = async (experiment) => {
    const zip = JSZip();
    zip.file("data.json", JSON.stringify(experiment));
    for (const img of experiment.imageStandalone) {
        const resp = await fetch(baseUrl + img.url);
        const image = await resp.blob();
        const ext = img.url.split('.').pop();
        const filename = `images/${img.name}.${ext}` 
        zip.file(filename, image, { binary: true });
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

