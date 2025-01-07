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

        isContainedIn(other: DeviceObject) {
            if (this.onTrial() && other.onTrial()) {
                const containedIn = this.onTrial()?.containedIn;
                return containedIn?.deviceItemName === other?.deviceItemName
                    && containedIn?.deviceTypeName === other?.deviceTypeName;
            }
            return false;
        }

        isSame(other: DeviceObject) {
            return this.onTrial()?.deviceItemName === other?.onTrial()?.deviceItemName
                && this.onTrial()?.deviceTypeName === other?.onTrial()?.deviceTypeName;
        }

        /** Sets the parent device of this device */
        setContainedIn(futureParent: DeviceObject | undefined) {
            if (futureParent && this.isSame(futureParent)) {
                return;
            }
            if (this.onTrial()) {
                const newData = { ...this.onTrial() };
                const parent = futureParent?.onTrial();
                if (parent) {
                    newData.containedIn = { deviceItemName: parent.deviceItemName, deviceTypeName: parent.deviceTypeName };
                } else {
                    delete newData.containedIn;
                }
                this.setOnTrial(newData);
            }
        }

        // /** Sets the child devices of this device */
        // setContained(others: DeviceObject[]) {
        //     if (this.onTrial()) {
        //         for (const other of others) {
        //             if (other.onTrial()) {
        //                 const newData = this.onTrial();
        //                 const containedIn = { deviceItemName: this.onTrial().deviceItemName, deviceTypeName: this.onTrial().deviceTypeName };
        //                 newData.containedIn = containedIn;
        //             }
        //         }
        //     }
        // }
    }

    const device = new DeviceObject();

    return {
        device,
    }
}