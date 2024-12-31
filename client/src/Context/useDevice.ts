import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import { RealMapName } from "../constants/constants";

export const useDevice = ({ deviceTypeName, deviceItemName }) => {
    const { currTrial, setTrialData } = useContext(experimentContext);

    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];

    class DeviceObject {
        private indexOnTrial: number = -1;
        public deviceTypeName: string = deviceTypeName;
        public deviceItemName: string = deviceItemName;

        onTrial() {
            if (this.indexOnTrial === -1) {
                this.indexOnTrial = devicesOnTrial.findIndex(d => d.deviceTypeName === deviceTypeName && d.deviceItemName === deviceItemName);
            }
            return devicesOnTrial[this.indexOnTrial];
        }

        setOnTrial(newData: any): void {
            const data = { ...currTrial.trial, devicesOnTrial: devicesOnTrial.slice() };
            data.devicesOnTrial[this.indexOnTrial] = newData;
            setTrialData(data);
        }

        hasLocation(): boolean {
            return this.onTrial()?.location?.coordinates !== undefined;
        }

        hasLocationOnMap(checkMapName: string | undefined = undefined): boolean {
            checkMapName ||= currTrial.shownMapName || RealMapName;
            return this.hasLocation() && this.onTrial()?.location?.name === checkMapName;
        }

        isContainedIn(potentialParent: DeviceObject) {
            if (this.onTrial() && potentialParent.onTrial()) {
                const containedIn = this.onTrial()?.containedIn;
                return containedIn?.deviceItemName === potentialParent?.deviceItemName
                    && containedIn?.deviceTypeName === potentialParent?.deviceTypeName;
            }
            return false;
        }
    }

    const device = new DeviceObject();

    return {
        device,
    }
}