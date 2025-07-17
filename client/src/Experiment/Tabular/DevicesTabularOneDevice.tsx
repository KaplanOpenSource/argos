import { Stack, TableCell, TableRow, Typography } from "@mui/material";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { useCurrTrial } from "../../Context/useCurrTrial";
import { ICoordinates, IDevice, IDeviceType } from "../../types/types";
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
  const { trial: trialOld } = useCurrTrial({});
  const { shownMap, trial, changeTrialObj } = useChosenTrial();

  const devices = deviceType?.devices || [];

  const devicesEnclosingList = devices.map(deviceItem => {
    return { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name, deviceType, deviceItem };
  });

  return (
    <>
      {devices.map((deviceItem, itr) => {
        const device = trialOld.getDevice(deviceType.name, deviceItem.name);

        const setDeviceItem = (val: IDevice) => {
          const t = structuredClone(deviceType);
          t.devices![itr] = val;
          setDeviceType(t);
        }

        const deviceOnTrial = trial?.findDevice({ deviceTypeName: deviceType.name!, deviceItemName: deviceItem.name! });

        const setLocation = (coords: ICoordinates) => {
          changeTrialObj(draft => {
            const dev = draft.findDevice(deviceOnTrial);
            dev?.setLocationOnMap(coords, shownMap?.name);
          })
        }

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
                  setValue={v => setLocation([v, deviceOnTrial!.location!.coordinates![1]])}
                />
                : null}
            </TableCell>
            <TableCell key={':tlng'}>
              {deviceOnTrial?.location?.coordinates?.length === 2
                ? <NumberCoordField
                  label={'Longitude'}
                  value={deviceOnTrial?.location?.coordinates[1]}
                  setValue={v => setLocation([deviceOnTrial!.location!.coordinates![0], v])}
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