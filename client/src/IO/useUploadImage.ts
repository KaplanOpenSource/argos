import { useCallback } from "react";
import { useTokenStore } from "../Context/useTokenStore";

export const useUploadImage = () => {
    const { isLoggedIn, axiosSecure } = useTokenStore();

    const uploadImage = useCallback(async (
        fileBlob: File,
        imageName: string,
        experimentName: string,
        blobFilenameOptional: string | undefined = undefined,
    ): Promise<{
        filename: string;
        height: number;
        width: number;
    } | undefined> => {
        try {
            if (!isLoggedIn()) {
                throw 'not logged in';
            }
            if (!fileBlob) {
                throw 'file is empty';
            }

            const { height, width, dataURL } = await getImageSize(fileBlob);
            if (!height || !width) {
                throw 'image is empty';
            }

            let filename = imageName + '.png';
            if (fileBlob.name) {
                filename = fileBlob.name;
            }
            if (blobFilenameOptional) {
                filename = blobFilenameOptional;
            }

            const formData = new FormData();
            formData.append('fileName', filename);
            formData.append('fileData', dataURL);
            formData.append('imageName', imageName);
            formData.append('experimentName', experimentName);
            const ret = await axiosSecure().post("upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log('uploaded:', ret);
            if (!ret?.data) {
                throw 'invalid server reply'
            }
            return { filename: ret.data.filename, height, width };
        } catch (e) {
            console.error(e);
            if (e?.response?.statusText) {
                alert('Image upload error: ' + (e?.response?.statusText as string).toLowerCase());
            } else {
                alert('Image upload error: ' + e);
            }
            return undefined;
        }
    }, [axiosSecure]);

    const getImageSize = async (
        imageFile: Blob,
    ): Promise<{
        width: number,
        height: number,
        dataURL: string,
    }> => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas') as HTMLCanvasElement;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw { error: 'Cannot create canvas' }
                }
                canvas.height = img.naturalHeight;
                canvas.width = img.naturalWidth;
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve({ height: img.naturalHeight, width: img.naturalWidth, dataURL })
            };
            const src = window.URL.createObjectURL(imageFile);
            img.src = src;
        })
    }

    return {
        uploadImage,
    }
}