import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";

export const useDevice = ({ deviceTypeName, deviceItemName }) => {
    const { currTrial, setTrialData } = useContext(experimentContext);

    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    const indexOnTrial = devicesOnTrial.findIndex(d => d.deviceTypeName === deviceTypeName && d.deviceItemName === deviceItemName);
    const deviceOnTrial = devicesOnTrial[indexOnTrial];

    return {
        device: {
            deviceOnTrial: () => {
                return deviceOnTrial;
            },
            setDeviceOnTrial: (newData: any): void => {
                const data = { ...currTrial.trial, devicesOnTrial: devicesOnTrial.slice() };
                data.devicesOnTrial[indexOnTrial] = newData;
                setTrialData(data);
            },
            hasLocation: (checkMapName: undefined | string) => {
                const ok = deviceOnTrial && deviceOnTrial.location && deviceOnTrial.location.coordinates;
                if (checkMapName === undefined) {
                    return ok;
                }
                return ok && deviceOnTrial.location.name === checkMapName;
            },
        }
    }
}