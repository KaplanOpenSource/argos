import { ChevronRight, ExpandMore, KeyboardDoubleArrowDown } from "@mui/icons-material";
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
  const [showTrials, setShowTrials] = useState({ show: false, types: new Set() });

  const { trial, experiment } = useChosenTrial();
  const showAllTypes = showTrials.show && showTrials.types.size === (experiment?.trialTypes.length || 1);
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
            tooltip={showTrials.show
              ? (showAllTypes ? "Showing values on all trials" : "Showing values on other trials")
              : "Hiding values on other trials"}
            onClick={() => setShowTrials(prev => {
              if (!prev.show) {
                return { show: true, types: new Set() };
              } else if (!showAllTypes) {
                return { show: true, types: new Set((experiment?.trialTypes || []).map(tt => tt.name)) };
              } else {
                return { show: false, types: new Set() };
              }
            })}
            style={{ margin: 0, padding: 0 }}
          >
            {showTrials.show
              ? (showAllTypes ? <KeyboardDoubleArrowDown /> : <ExpandMore />)
              : <ChevronRight />}
          </ButtonTooltip>
        </>)}
      />
      {showTrials.show
        ? experiment?.trialTypes
          .map(trialType => {

            const typeOpen = showTrials.types.has(trialType.name);
            const setTypeOpen = (yes: boolean) => {
              setShowTrials(prev => {
                const newval = structuredClone(prev);
                yes ? newval.types.add(trialType.name) : newval.types.delete(trialType.name)
                return newval;
              });
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