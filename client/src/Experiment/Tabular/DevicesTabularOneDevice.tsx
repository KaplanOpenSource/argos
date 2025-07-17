import { Stack, TableCell, TableRow, Typography } from "@mui/material";
import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { useCurrTrial } from "../../Context/useCurrTrial";
import { IDeviceType } from "../../types/types";
import { SelectDeviceButton } from "../SelectDeviceButton";
import { DevicesTabularOneAttr } from "./DevicesTabularOneAttr";
import { NumberCoordField } from "./NumberCoordField";

// TODO: Use TrialObj instead

export const DevicesTabularOneDevice = ({
  deviceType,
  setDeviceType,
}: {
  deviceType: IDeviceType,
  setDeviceType: (v: IDeviceType) => void,
}) => {
  const { currTrial } = useExperimentProvider();
  const { trial } = useCurrTrial({});

  const devices = deviceType?.devices || [];
  const devicesOnTrial = currTrial?.trial?.devicesOnTrial;

  const devicesEnclosingList = devices.map(deviceItem => {
    return { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name, deviceType, deviceItem };
  });

  return (
    <>
      {devices.map((deviceItem, itr) => {
        const device = trial.getDevice(deviceType.name, deviceItem.name);

        const setDeviceItem = (val) => {
          const t = structuredClone(deviceType);
          t.devices[itr] = val;
          setDeviceType(t);
        }

        const deviceOnTrial = devicesOnTrial?.find(t => {
          return t.deviceItemName === deviceItem.name && t.deviceTypeName === deviceType.name;
        });

        return (
          <TableRow
            key={deviceItem.trackUuid}
          >
            <TableCell key={':tr'} sx={{ paddingY: 0, marginY: 0 }}>
              <Stack direction={'row'} sx={{ padding: 0, margin: 0, alignItems: 'center' }}>
                <SelectDeviceButton
                  deviceItem={deviceItem}
                  deviceType={deviceType}
                  devicesEnclosingList={devicesEnclosingList}
                />
                <Typography>
                  {deviceItem.name}
                </Typography>
              </Stack>
            </TableCell>
            <TableCell key={':tlat'}>
              {deviceOnTrial?.location?.coordinates?.length === 2
                ? <NumberCoordField
                  label={'Latitude'}
                  value={deviceOnTrial?.location?.coordinates[0]}
                  setValue={v => {
                    device.setLocationOnMap([v, device.getLocation().coordinates[1]], currTrial.shownMapName);
                  }}
                />
                : null}
            </TableCell>
            <TableCell key={':tlng'}>
              {deviceOnTrial?.location?.coordinates?.length === 2
                ? <NumberCoordField
                  label={'Longitude'}
                  value={deviceOnTrial?.location?.coordinates[1]}
                  setValue={v => {
                    device.setLocationOnMap([device.getLocation().coordinates[0], v], currTrial.shownMapName);
                  }}
                />
                : null}
            </TableCell>
            {deviceType?.attributeTypes?.map(attrType => {
              return (
                <TableCell
                  key={attrType.name}
                >
                  <DevicesTabularOneAttr
                    attrType={attrType}
                    deviceType={deviceType}
                    deviceItem={deviceItem}
                    setDeviceItem={setDeviceItem}
                  />
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </>
  )
}