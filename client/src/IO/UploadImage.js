import { useCallback, useContext } from "react";
import { TokenContext } from "../App/TokenContext";

export const useUploadImage = () => {
    const { axiosToken } = useContext(TokenContext);

    const uploadImage = useCallback(async (fileBlob, imageName, experimentName, blobFilenameOptional) => {
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
        const ret = await axiosToken().post("upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log('uploaded:', ret);
        const error = (ret.data || { error: 'invalid server reply' }).error;
        if (error) {
            alert(error);
            return;
        }

        return { filename: ret.data.filename, height, width };
    }, [axiosToken]);

    const getImageSize = async (imageFile) => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                resolve([img.naturalHeight, img.naturalWidth])
            };
            img.src = window.URL.createObjectURL(imageFile);
        })
    }

    const downloadImageAsUrl = useCallback(async (experimentName, dataFilename) => {
        const url = "uploads/" + experimentName + "/" + dataFilename;
        const resp = await axiosToken().get(url, { responseType: "arraybuffer" });
        const base64 = `data:image/png;base64, ` + btoa(new Uint8Array(resp.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), ''));
        return base64;
    }, [axiosToken]);

    return {
        uploadImage,
        downloadImageAsUrl,
    }
}