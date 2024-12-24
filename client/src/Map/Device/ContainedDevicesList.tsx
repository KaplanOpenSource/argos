import React, { useContext } from "react";
import { ContainedDevice } from "../../Experiment/Contained/ContainedDevice";
import { experimentContext } from "../../Context/ExperimentProvider";

export const ContainedDevicesList = ({
    containedDevices,
    devicesOnTrial,
}: {
    containedDevices: any[],
    devicesOnTrial: any[],
}) => {
    const { currTrial, setTrialData } = useContext(experimentContext);

    return (
        <>
            {containedDevices?.map(({ dev, index }) => (
                <ContainedDevice
                    key={'contained ' + dev.deviceItemName + '_' + dev.deviceTypeName}
                    deviceItemName={dev.deviceItemName}
                    deviceTypeName={dev.deviceTypeName}
                    disconnectDevice={() => {
                        const devs = [...devicesOnTrial];
                        devs[index] = { ...dev };
                        delete devs[index].containedIn;
                        setTrialData({ ...currTrial.trial, devicesOnTrial: devs });
                    }}
                />
            ))}
        </>
    )
}