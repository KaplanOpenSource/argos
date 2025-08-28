import { Stack, TableCell, TableRow } from "@mui/material";
import { ReactNode } from "react";
import { AttributeTypeObj, DeviceItemObj, DeviceTypeObj, TrialObj } from "../../objects";
import { AttributeItemOnTrial } from "../AttributeItemOnTrial";
import { NumberCoordField } from "./NumberCoordField";

export const DevicesTabularDeviceTrial = ({
  deviceItem,
  deviceType,
  attributeTypes,
  trial,
  rowHeader,
  // deviceOnTrial,
}: {
  deviceItem: DeviceItemObj,
  deviceType: DeviceTypeObj,
  attributeTypes: AttributeTypeObj[],
  trial: TrialObj | undefined,
  rowHeader: ReactNode,
  // deviceOnTrial: DeviceOnTrialObj | undefined,
}) => {
  // const { shownMap, trial, changeTrialObj } = useChosenTrial();

  // const devicesEnclosingList: any[] = [];
  // devices.map(deviceItem => {
  //   return { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name, deviceType, deviceItem };
  // });

  const deviceOnTrial = trial?.findDevice({ deviceTypeName: deviceType.name!, deviceItemName: deviceItem.name! });
  const hasLocation = deviceOnTrial?.location?.coordinates?.length === 2 && deviceOnTrial?.location?.coordinates.every(x => Number.isFinite(x));
  // const setLocation = (coords: ICoordinates) => {
  //   changeTrialObj(draft => {
  //     const dev = draft.findDevice(deviceOnTrial);
  //     dev?.setLocationOnMap(coords, shownMap?.name);
  //   })
  // }

  // if (!showAllDevices && !deviceOnTrial) {
  //   return null;
  // }

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
          {/* <Typography>
            {deviceItem.name}
          </Typography>
          {buttonNearName} */}
          {rowHeader}
        </Stack>
      </TableCell>
      <TableCell key={':tlat'}>
        {hasLocation
          ? <NumberCoordField
            label={'Latitude'}
            value={deviceOnTrial.location!.coordinates![0] || 0}
            setValue={v => { }}
          // setLocation([v, deviceOnTrial.location!.coordinates![1] || 0])}
          />
          : null}
      </TableCell>
      <TableCell key={':tlng'}>
        {hasLocation
          ? <NumberCoordField
            label={'Longitude'}
            value={deviceOnTrial.location!.coordinates![1] || 0}
            setValue={v => { }}
          // setValue={v => setLocation([deviceOnTrial.location!.coordinates![0] || 0, v])}
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