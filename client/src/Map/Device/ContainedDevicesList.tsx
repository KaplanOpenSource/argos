import { Box } from "@mui/material";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { ContainedDevice } from "../../Experiment/Contained/ContainedDevice";
import { DeviceOnTrialObj } from "../../objects";

export const ContainedDevicesList = ({
  containedDevices,
}: {
  containedDevices: {
    dev: DeviceOnTrialObj;
    index: number;
  }[],
}) => {
  const { changeTrialObj } = useChosenTrial();

  return containedDevices?.length > 0
    ? (
      <>
        <br />
        contains:
        <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          {containedDevices?.map(({ dev }) => (
            <ContainedDevice
              key={'contained ' + dev.deviceItemName + '_' + dev.deviceTypeName}
              deviceItemName={dev.deviceItemName}
              deviceTypeName={dev.deviceTypeName}
              disconnectDevice={() => {
                changeTrialObj(draft => draft.findDevice(dev)?.setContainedIn(undefined));
              }}
            />
          ))}
        </Box>
      </>
    )
    : null
}