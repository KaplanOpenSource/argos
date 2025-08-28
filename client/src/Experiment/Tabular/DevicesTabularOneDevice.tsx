import { Stack, TableCell, TableRow, Typography } from "@mui/material";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { AttributeTypeObj, DeviceTypeObj } from "../../objects";
import { ICoordinates } from "../../types/types";
import { AttributeItemOnTrial } from "../AttributeItemOnTrial";
import { SelectDeviceButton } from "../SelectDeviceButton";
import { NumberCoordField } from "./NumberCoordField";

// TODO: Use TrialObj instead

export const DevicesTabularOneDevice = ({
  deviceType,
  attributeTypes,
}: {
  deviceType: DeviceTypeObj,
  attributeTypes: AttributeTypeObj[],
}) => {
  const { shownMap, trial, changeTrialObj } = useChosenTrial();

  const devices = deviceType?.devices || [];

  const devicesEnclosingList = devices.map(deviceItem => {
    return { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name, deviceType, deviceItem };
  });

  return (
    <>
      {devices.map((deviceItem, itr) => {
        const deviceOnTrial = trial?.findDevice({ deviceTypeName: deviceType.name!, deviceItemName: deviceItem.name! });
        const hasLocation = deviceOnTrial?.location?.coordinates?.length === 2 && deviceOnTrial?.location?.coordinates.every(x => Number.isFinite(x));

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
              {hasLocation
                ? <NumberCoordField
                  label={'Latitude'}
                  value={deviceOnTrial.location!.coordinates![0] || 0}
                  setValue={v => setLocation([v, deviceOnTrial.location!.coordinates![1] || 0])}
                />
                : null}
            </TableCell>
            <TableCell key={':tlng'}>
              {hasLocation
                ? <NumberCoordField
                  label={'Longitude'}
                  value={deviceOnTrial.location!.coordinates![1] || 0}
                  setValue={v => setLocation([deviceOnTrial.location!.coordinates![0] || 0, v])}
                />
                : null}
            </TableCell>
            {attributeTypes.map(attrType => {
              return (
                <TableCell
                  key={attrType.name}
                >
                  {deviceOnTrial
                    ?
                    <AttributeItemOnTrial
                      attrType={attrType}
                      deviceOnTrial={deviceOnTrial}
                    />
                    : null}
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </>
  )
}