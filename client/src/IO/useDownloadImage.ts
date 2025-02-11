import { useCallback } from "react";
import { useTokenStore } from "../Context/useTokenStore";
import { useImageCache } from "./useImageCache";

export const useDownloadImage = () => {
    const { isLoggedIn, axiosSecure } = useTokenStore();
    const { getCachedImage, addCachedImage } = useImageCache();

    const downloadImageAsUrl = useCallback(async (
        experimentName: string,
        dataFilename: string
    ): Promise<string | undefined> => {
        const cached = getCachedImage(experimentName, dataFilename);
        if (cached) {
            return cached;
        }
        if (!isLoggedIn()) {
            console.error('not logged in')
            return undefined;
        }
        try {
            const url = "uploads/" + experimentName + "/" + dataFilename;
            const resp = await axiosSecure().get(url, { responseType: "arraybuffer" });
            const converted = new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), '');
            const base64 = `data:image/png;base64, ` + btoa(converted);
            console.log('image read ', dataFilename);
            addCachedImage(experimentName, dataFilename, base64);
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
        downloadImageAsUrl,
        downloadImageAsBlob,
    }
}