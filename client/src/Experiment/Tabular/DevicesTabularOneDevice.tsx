import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { Stack, TableCell, TableRow, Typography } from "@mui/material";
import { Fragment, useState } from "react";
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
  const [trialTypesOpen, setTrialTypesOpen] = useState<string[]>([]);

  const { trial, experiment } = useChosenTrial();

  const deviceOnTrial = trial?.findDevice({ deviceTypeName: deviceType.name!, deviceItemName: deviceItem.name! });

  if (!showAllDevices && !deviceOnTrial) {
    return null;
  }

  return (
    <>
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
        ? experiment?.trialTypes
          .map(trialType => {

            const typeOpen = trialTypesOpen.includes(trialType.name);
            const setTypeOpen = (yes: boolean) => {
              const newval = trialTypesOpen.filter(t => t !== trialType.name);
              if (yes) {
                newval.push(trialType.name);
              }
              setTrialTypesOpen(newval);
            }

            return (
              <Fragment
                key={'frag' + trialType.trackUuid + ' ' + deviceItem.trackUuid}
              >
                <TableRow
                  key={trialType.trackUuid + ' ' + deviceItem.trackUuid}
                >
                  <TableCell key={':tr'} sx={{ paddingY: 0, marginY: 0 }} colSpan={attributeTypes.length + 3}>
                    <Stack direction={'row'} sx={{ padding: 0, margin: 0, alignItems: 'center' }}>
                      <Typography sx={{ marginLeft: 2 }}>
                        {trialType?.name}
                      </Typography>
                      <ButtonTooltip
                        tooltip={typeOpen ? "Showing this trial type" : "Hiding this trial type"}
                        onClick={() => setTypeOpen(!typeOpen)}
                        style={{ margin: 0, padding: 0 }}
                      >
                        {typeOpen ? <ExpandMore /> : <ChevronRight />}
                      </ButtonTooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
                {typeOpen
                  ? trialType?.trials?.map(otherTrial => (
                    <DevicesTabularDeviceTrial
                      key={otherTrial.trackUuid + '_' + deviceItem.trackUuid}
                      deviceItem={deviceItem}
                      deviceType={deviceType}
                      attributeTypes={attributeTypes}
                      trial={otherTrial}
                      rowHeader={<>
                        <Typography sx={{ marginLeft: 4 }}>
                          {otherTrial?.name}
                        </Typography>
                      </>}
                    />
                  ))
                  : null}
              </Fragment>
            );
          })
        : null}
    </>
  )
}