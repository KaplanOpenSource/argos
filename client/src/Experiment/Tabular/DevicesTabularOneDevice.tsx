import { Stack, TableCell, TableRow, Typography } from "@mui/material";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { AttributeTypeObj, DeviceItemObj, DeviceTypeObj } from "../../objects";
import { ICoordinates } from "../../types/types";
import { AttributeItemOnTrial } from "../AttributeItemOnTrial";
import { NumberCoordField } from "./NumberCoordField";

export const DevicesTabularOneDevice = ({
  deviceItem,
  deviceType,
  attributeTypes,
  showAllDevices,
}: {
  deviceItem: DeviceItemObj,
  deviceType: DeviceTypeObj,
  attributeTypes: AttributeTypeObj[],
  showAllDevices: boolean,
}) => {
  const { shownMap, trial, changeTrialObj } = useChosenTrial();

  // const devicesEnclosingList: any[] = [];
  // devices.map(deviceItem => {
  //   return { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name, deviceType, deviceItem };
  // });

  const deviceOnTrial = trial?.findDevice({ deviceTypeName: deviceType.name!, deviceItemName: deviceItem.name! });
  const hasLocation = deviceOnTrial?.location?.coordinates?.length === 2 && deviceOnTrial?.location?.coordinates.every(x => Number.isFinite(x));
  const setLocation = (coords: ICoordinates) => {
    changeTrialObj(draft => {
      const dev = draft.findDevice(deviceOnTrial);
      dev?.setLocationOnMap(coords, shownMap?.name);
    })
  }

  if (!showAllDevices && !deviceOnTrial) {
    return null;
  }

  return (
    <TableRow
      key={deviceItem.trackUuid}
    >
      <TableCell key={':tr'} sx={{ paddingY: 0, marginY: 0 }}>
        <Stack direction={'row'} sx={{ padding: 0, margin: 0, alignItems: 'center' }}>
          {/* <SelectDeviceButton
                  deviceItem={deviceItem}
                  deviceType={deviceType}
                  devicesEnclosingList={devicesEnclosingList}
                /> */}
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
              ? <AttributeItemOnTrial
                attrType={attrType}
                deviceOnTrial={deviceOnTrial}
              />
              : null}
          </TableCell>
        )
      })}
    </TableRow>
  )
}