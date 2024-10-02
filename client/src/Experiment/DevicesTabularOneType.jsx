import { TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material"
import { AttributeItemOne } from "./AttributeItemList";
import { SCOPE_EXPERIMENT } from "./AttributeType";
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { createNewName } from "../Utils/utils";
import { Add } from "@mui/icons-material";
import { AddMultipleDevices } from "./AddMultipleDevices";
import { assignUuids } from "../Context/TrackUuidUtils";

export const DevicesTabularOneType = ({ deviceType, setDeviceType }) => {
    return (
        <>
            <TableHead key={':th_' + deviceType.name}>
                <TableRow
                    sx={{
                        backgroundColor: 'lightgray'
                    }}
                >
                    <TableCell key={':tt'}>
                        Device Type
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
                {deviceType?.devices?.map((device, itr) => {
                    const setDevice = (val) => {
                        const t = structuredClone(deviceType);
                        t.devices[itr] = val;
                        setDeviceType(t);
                    }
                    return (
                        <TableRow
                            key={device.trackUuid}
                        >
                            <TableCell component="th" scope="row" key={':tt'}>
                                {deviceType.name}
                            </TableCell>
                            <TableCell key={':tr'}>{device.name}</TableCell>
                            {deviceType?.attributeTypes?.map(attrType => {
                                return (
                                    <TableCell
                                        key={attrType.name}
                                    >
                                        <AttributeItemOne
                                            attrType={attrType}
                                            data={device}
                                            setData={val => setDevice(val)}
                                            scope={SCOPE_EXPERIMENT}
                                            reduceNames={true}
                                        />
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    )
                })}
            </TableBody>
        </>
    )
}