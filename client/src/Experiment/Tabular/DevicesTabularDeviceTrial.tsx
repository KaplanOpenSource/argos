import { Stack, TableCell, TableRow } from "@mui/material";
import { ReactNode } from "react";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { useExperiments } from "../../Context/useExperiments";
import { AttributeTypeObj, DeviceItemObj, DeviceTypeObj, ExperimentObj, TrialObj } from "../../objects";
import { ICoordinates } from "../../types/types";
import { AttributeItemOnTrial } from "../AttributeItemOnTrial";
import { NumberCoordField } from "./NumberCoordField";

export const DevicesTabularDeviceTrial = ({
  deviceItem,
  deviceType,
  attributeTypes,
  trial,
  rowHeader,
}: {
  deviceItem: DeviceItemObj,
  deviceType: DeviceTypeObj,
  attributeTypes: AttributeTypeObj[],
  trial: TrialObj | undefined,
  rowHeader: ReactNode,
}) => {
  const { setExperiment } = useExperiments();
  const { shownMap } = useChosenTrial();

  const deviceOnTrial = trial?.findDevice({ deviceTypeName: deviceType.name!, deviceItemName: deviceItem.name! });
  const hasLocation = deviceOnTrial?.location?.coordinates?.length === 2 && deviceOnTrial?.location?.coordinates.every(x => Number.isFinite(x));

  const setLocation = (coords: ICoordinates) => {
    if (hasLocation) {
      const exp = new ExperimentObj(deviceOnTrial.trial.trialType.experiment!);
      const trial = exp?.findTrial(deviceOnTrial.trial);
      const dev = trial?.findDevice(deviceOnTrial);
      if (dev) {
        dev.setLocationOnMap(coords, shownMap?.name);
        setExperiment(exp.name, exp.toJson(true));
      }
    }
  }

  return (
    <TableRow
      key={deviceItem.trackUuid}
    >
      <TableCell key={':tr'} sx={{ paddingY: 0, marginY: 0 }}>
        <Stack direction={'row'} sx={{ padding: 0, margin: 0, alignItems: 'center' }}>
          {rowHeader}
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