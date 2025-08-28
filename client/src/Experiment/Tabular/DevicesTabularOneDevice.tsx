import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { AttributeTypeObj, DeviceItemObj, DeviceTypeObj } from "../../objects";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { DevicesTabularDeviceTrial } from "./DevicesTabularDeviceTrial";

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
  const [showAllTrials, setShowAllTrials] = useState(false);

  const { shownMap, trial, changeTrialObj, experiment } = useChosenTrial();

  // const devicesEnclosingList: any[] = [];
  // devices.map(deviceItem => {
  //   return { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name, deviceType, deviceItem };
  // });

  const deviceOnTrial = trial?.findDevice({ deviceTypeName: deviceType.name!, deviceItemName: deviceItem.name! });

  if (!showAllDevices && !deviceOnTrial) {
    return null;
  }

  return (<>
    <DevicesTabularDeviceTrial
      key={(trial?.trackUuid || '') + '_' + deviceItem.trackUuid}
      deviceItem={deviceItem}
      deviceType={deviceType}
      attributeTypes={attributeTypes}
      trial={trial}
      rowHeader={(<>
        <Typography>
          {deviceItem.name}
        </Typography>
        <ButtonTooltip
          tooltip={showAllTrials ? "Showing values on all trials" : "Hiding values on other trials"}
          onClick={() => setShowAllTrials(!showAllTrials)}
          style={{ margin: 0, padding: 0 }}
        >
          {showAllTrials ? <ExpandMore /> : <ChevronRight />}
        </ButtonTooltip>
      </>)}
    />
    {showAllTrials
      ? experiment?.trialTypes.flatMap(trialType => trialType?.trials?.flatMap(otherTrial => (
        <DevicesTabularDeviceTrial
          key={otherTrial.trackUuid + '_' + deviceItem.trackUuid}
          deviceItem={deviceItem}
          deviceType={deviceType}
          attributeTypes={attributeTypes}
          trial={otherTrial}
          rowHeader={<>
            <Typography sx={{ marginLeft: 2 }}>
              {otherTrial?.name}
            </Typography>
          </>}
        />
      )))
      : null}
  </>)


  // !showAllTrials
  //   ? (
  //   ): (

  //     )

  // return (
  //   <TableRow
  //     key={deviceItem.trackUuid}
  //   >
  //     <TableCell key={':tr'} sx={{ paddingY: 0, marginY: 0 }}>
  //       <Stack direction={'row'} sx={{ padding: 0, margin: 0, alignItems: 'center' }}>
  //         {/* <SelectDeviceButton
  //                 deviceItem={deviceItem}
  //                 deviceType={deviceType}
  //                 devicesEnclosingList={devicesEnclosingList}
  //               /> */}
  //         <Typography>
  //           {deviceItem.name}
  //         </Typography>
  //         <ButtonTooltip
  //           tooltip={showAllTrials ? "Showing values on all trials" : "Hiding values on other trials"}
  //           onClick={() => setShowAllTrials(!showAllTrials)}
  //           style={{ margin: 0, padding: 0 }}
  //         >
  //           {showAllTrials ? <ExpandMore /> : <ChevronRight />}
  //         </ButtonTooltip>

  //       </Stack>
  //     </TableCell>
  //     <TableCell key={':tlat'}>
  //       {hasLocation
  //         ? <NumberCoordField
  //           label={'Latitude'}
  //           value={deviceOnTrial.location!.coordinates![0] || 0}
  //           setValue={v => setLocation([v, deviceOnTrial.location!.coordinates![1] || 0])}
  //         />
  //         : null}
  //     </TableCell>
  //     <TableCell key={':tlng'}>
  //       {hasLocation
  //         ? <NumberCoordField
  //           label={'Longitude'}
  //           value={deviceOnTrial.location!.coordinates![1] || 0}
  //           setValue={v => setLocation([deviceOnTrial.location!.coordinates![0] || 0, v])}
  //         />
  //         : null}
  //     </TableCell>
  //     {attributeTypes.map(attrType => {
  //       return (
  //         <TableCell
  //           key={attrType.name}
  //         >
  //           {deviceOnTrial
  //             ? <AttributeItemOnTrial
  //               attrType={attrType}
  //               deviceOnTrial={deviceOnTrial}
  //             />
  //             : null}
  //         </TableCell>
  //       )
  //     })}
  //   </TableRow>
  // )
}