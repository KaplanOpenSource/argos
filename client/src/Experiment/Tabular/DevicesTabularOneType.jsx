import { TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material"
import { AttributeItemOne } from "../AttributeItemList";
import { SCOPE_EXPERIMENT } from "../AttributeType";
import { AttributeTypesDialogButton } from "../AttributeTypesDialogButton";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { createNewName } from "../../Utils/utils";
import { Add, ChevronRight, ExpandMore } from "@mui/icons-material";
import { AddMultipleDevices } from "../AddMultipleDevices";
import { assignUuids } from "../../Context/TrackUuidUtils";
import { useState } from "react";
import { DevicesTabularOneDevice } from "./DevicesTabularOneDevice";

export const DevicesTabularOneType = ({ deviceType, setDeviceType }) => {
    const [open, setOpen] = useState(true);
    return (
        <>
            <TableHead key={':th_' + deviceType.name}>
                <TableRow
                    sx={{
                        backgroundColor: 'lightgray'
                    }}
                >
                    <TableCell key={':tt'}
                        onClick={() => setOpen(!open)}
                    >
                        <Tooltip
                            title={open ? "Click to collapse devices" : "Click to show devices"}
                        >
                            <span>
                                Device Type
                            </span>
                        </Tooltip>
                        <ButtonTooltip
                            tooltip={open ? "Collapse devices" : "Show devices"}
                            onClick={() => setOpen(!open)}
                            style={{ margin: 0, padding: 0 }}
                        >
                            {open ? <ExpandMore /> : <ChevronRight />}
                        </ButtonTooltip>
                        <AttributeTypesDialogButton
                            data={deviceType}
                            setData={val => setDeviceType(val)}
                            isOfDevice={true}
                        />
                    </TableCell>
                    <TableCell key={':tr'}>
                        Device
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
                            addDevices={newDevices => {
                                setDeviceType({ ...deviceType, devices: [...(deviceType.devices || []), ...newDevices] })
                            }}
                        />
                    </TableCell>
                    {deviceType?.attributeTypes?.map(attrType => {
                        let shortName = attrType.name;
                        if (shortName.length > 20) {
                            shortName = shortName.substring(0, 5) + '..' + shortName.substring(shortName.length - 8);
                        }
                        return (
                            <Tooltip
                                key={attrType.name}
                                title={attrType.name}
                            >
                                <TableCell
                                    key={attrType.name}
                                >
                                    {shortName}
                                </TableCell>
                            </Tooltip>
                        )
                    })}
                </TableRow>
            </TableHead>
            <TableBody key={':tb_' + deviceType.name}>
                {open
                    ? (
                        <DevicesTabularOneDevice
                            deviceType={deviceType}
                            setDeviceType={setDeviceType}
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
                                colSpan={'100%'}
                            >
                            </TableCell>
                        </TableRow>
                    )
                }
            </TableBody>
        </>
    )
}