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

    return {
        uploadImage,
    }
}