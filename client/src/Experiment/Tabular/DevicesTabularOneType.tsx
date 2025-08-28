import { ChevronRight, ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import { TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { useState } from "react";
import { DeviceTypeObj } from "../../objects";
import { ScopeEnum } from "../../types/ScopeEnum";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
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
            {deviceType.name}
            <ButtonTooltip
              tooltip={open ? "Collapse devices" : "Show devices"}
              onClick={() => setOpen(!open)}
              style={{ margin: 0, padding: 0 }}
            >
              {open ? <ExpandMore /> : <ChevronRight />}
            </ButtonTooltip>
            <ButtonTooltip
              tooltip={showAllDevices ? "Showing all devices" : "Showing just placed devices"}
              onClick={() => setShowAllDevices(!showAllDevices)}
              style={{ margin: 0, padding: 0 }}
            >
              {showAllDevices ? <Visibility /> : <VisibilityOff />}
            </ButtonTooltip>
            {/* <AttributeTypesDialogButton
              data={deviceType}
              setData={(val: IDeviceType) => setDeviceType(val)}
              isOfDevice={true}
            />
            <ButtonTooltip
              tooltip="Add new device"
              onClick={e => {
                e.stopPropagation();
                const name = createNewName(deviceType.devices, 'New Device');
                setDeviceType({ ...deviceType, devices: [...(deviceType.devices || []), assignUuids({ name })] });
              }}
            >
              <Add />
            </ButtonTooltip>
            <AddMultipleDevices
              deviceType={deviceType}
              addDevices={(newDevices: IDevice[]) => {
                setDeviceType({ ...deviceType, devices: [...(deviceType.devices || []), ...newDevices] })
              }}
            /> */}
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
          ? (
            <DevicesTabularOneDevice
              deviceType={deviceType}
              attributeTypes={attributeTypes}
              showAllDevices={showAllDevices}
            />
          )
          : (
            <TableRow
              style={{
                backgroundSize: "10px 10px",
                background: "repeating-linear-gradient(-45deg,#fff,#fff 10px,#eee 10px,#eee 20px)",
              }}
              onClick={() => setOpen(true)}
            >
              <TableCell component="th" scope="row" key={'name'}>
                {deviceType.name}
              </TableCell>
              <TableCell component="th" scope="row" key={'num'}>
                {deviceType?.devices?.length || 0} devices (collapsed)
              </TableCell>
              <TableCell key={'stripes'}
                colSpan={attributeTypes.length + 1}
              >
              </TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </>
  )
}
