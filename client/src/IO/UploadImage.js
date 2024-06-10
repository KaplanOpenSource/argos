import { baseUrl } from "../Context/FetchExperiment";

const getImageSize = async (imageFile) => {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            resolve([img.naturalHeight, img.naturalWidth])
        };
        img.src = window.URL.createObjectURL(imageFile);
    })
}

export const UploadImage = async (fileBlob, imageName, experimentName, blobFilenameOptional) => {
    if (!fileBlob) {
        return;
    }
    const [height, width] = await getImageSize(fileBlob);
    if (!height || !width) {
        return;
    }

    const formData = new FormData();
    formData.append('file', fileBlob, blobFilenameOptional);
    formData.append('imageName', imageName);
    formData.append('experimentName', experimentName);
    const resp = await fetch(baseUrl + "/upload", {
        method: 'POST',
        body: formData,
    });
    const ret = await resp.json();
    console.log('uploaded:', ret);
    const error = (ret || { error: 'invalid server reply' }).error;
    if (error) {
        alert(error);
        return;
    }

    return { filename: ret.filename, height, width };
}