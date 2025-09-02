import { ChevronRight, ExpandMore, KeyboardDoubleArrowDown } from "@mui/icons-material";
import { Stack, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { useState } from "react";
import { DeviceTypeObj } from "../../objects";
import { ScopeEnum } from "../../types/ScopeEnum";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { ContextMenu } from "../../Utils/ContextMenu";
import { shortenName } from "../../Utils/utils";
import { DevicesTabularOneDevice } from "./DevicesTabularOneDevice";

export const DevicesTabularOneType = ({
  deviceType,
}: {
  deviceType: DeviceTypeObj,
}) => {
  const [open, setOpen] = useState(true);
  const [showAllDevices, setShowAllDevices] = useState(false);
  const attributeTypes = (deviceType?.attributeTypes || []).filter(x => x.scope === ScopeEnum.SCOPE_TRIAL);
  return (
    <>
      <TableHead key={':th_' + deviceType.name}>
        <TableRow
          sx={{
            "& th": {
              backgroundColor: "whitesmoke"
            }
          }}
        >
          <TableCell key={':tr'}
            sx={{ paddingRight: 0 }}
          >
            <Stack direction='row'>
              {deviceType.name}
              <ContextMenu
                menuItems={[
                  { label: "Show all devices", callback: () => { setOpen(true); setShowAllDevices(true); } },
                  { label: "Show just placed devices", callback: () => { setOpen(true); setShowAllDevices(false); } },
                  { label: "Hide all devices", callback: () => { setOpen(false); setShowAllDevices(false); } },
                ]}
              >
                <ButtonTooltip
                  tooltip={open
                    ? (showAllDevices
                      ? "Showing all devices"
                      : "Showing just placed devices")
                    : "Devices are collapsed, click to show"
                  }
                  style={{ margin: 0, padding: 0 }}
                  onClick={() => {
                    if (!open) {
                      setOpen(true);
                      setShowAllDevices(false);
                    } else if (!showAllDevices) {
                      setOpen(true);
                      setShowAllDevices(true);
                    } else {
                      setOpen(false);
                      setShowAllDevices(false);
                    }
                  }}
                >
                  {open
                    ? (showAllDevices ? <KeyboardDoubleArrowDown /> : <ExpandMore />)
                    : <ChevronRight />
                  }
                </ButtonTooltip>
              </ContextMenu>
            </Stack>
          </TableCell>
          <TableCell key={':tlat'}>
            Latitude
          </TableCell>
          <TableCell key={':tlng'}>
            Longitude
          </TableCell>
          {attributeTypes.map(attrType => (
            <Tooltip
              key={attrType.name}
              title={attrType.name}
            >
              <TableCell
                key={attrType.name}
              >
                {shortenName(attrType.name + '')}
              </TableCell>
            </Tooltip>
          ))}
        </TableRow>
      </TableHead>
      <TableBody key={':tb_' + deviceType.name}>
        {open
          ? (deviceType?.devices || []).map((deviceItem) => (
            <DevicesTabularOneDevice
              key={deviceItem.trackUuid}
              deviceItem={deviceItem}
              deviceType={deviceType}
              attributeTypes={attributeTypes}
              showAllDevices={showAllDevices}
            />
          ))
          : null
        }
      </TableBody>
    </>
  )
}
