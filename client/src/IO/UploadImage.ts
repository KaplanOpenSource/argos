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
            alert('Image upload error: ' + e);
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

    const downloadImageAsUrl = useCallback(async (
        experimentName: string,
        dataFilename: string
    ): Promise<string | undefined> => {
        if (!isLoggedIn()) {
            console.error('not logged in')
            return undefined;
        }
        try {
            const url = "uploads/" + experimentName + "/" + dataFilename;
            const resp = await axiosSecure().get(url, { responseType: "arraybuffer" });
            const converted = new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), '');
            const base64 = `data:image/png;base64, ` + btoa(converted);
            return base64;
        } catch (e) {
            console.error('download error:', e)
            return undefined;
        }
    }, [axiosSecure]);

    const downloadImageAsBlob = useCallback(async (
        experimentName: string,
        dataFilename: string,
    ): Promise<Blob | undefined> => {
        if (!isLoggedIn()) {
            console.error('not logged in')
            return undefined;
        }
        try {
            const url = "uploads/" + experimentName + "/" + dataFilename;
            const resp = await axiosSecure().get(url, { responseType: "blob" });
            return resp.data;
        } catch (e) {
            console.error('download error:', e)
            return undefined;
        }
    }, [axiosSecure]);

    return {
        uploadImage,
        downloadImageAsUrl,
        downloadImageAsBlob,
    }
}