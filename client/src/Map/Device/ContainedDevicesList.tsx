import React, { useContext } from "react";
import { ContainedDevice } from "../../Experiment/Contained/ContainedDevice";
import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { Box } from "@mui/material";

export const ContainedDevicesList = ({
    containedDevices,
    devicesOnTrial,
}: {
    containedDevices: any[],
    devicesOnTrial: any[],
}) => {
    const { currTrial, setTrialData } = useExperimentProvider();

    return (
        <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
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
        </Box>
    )
}