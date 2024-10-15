import { TableCell, TableRow } from "@mui/material";
import { DevicesTabularOneAttr } from "./DevicesTabularOneAttr";

export const DevicesTabularOneDevice = ({ deviceType, setDeviceType }) => {
    return (
        <>
            {deviceType?.devices?.map((deviceItem, itr) => {
                const setDeviceItem = (val) => {
                    const t = structuredClone(deviceType);
                    t.devices[itr] = val;
                    setDeviceType(t);
                }
                return (
                    <TableRow
                        key={deviceItem.trackUuid}
                    >
                        <TableCell component="th" scope="row" key={':tt'}>
                            {deviceType.name}
                        </TableCell>
                        <TableCell key={':tr'}>{deviceItem.name}</TableCell>
                        {deviceType?.attributeTypes?.map(attrType => {
                            return (
                                <TableCell
                                    key={attrType.name}
                                >
                                    <DevicesTabularOneAttr
                                        attrType={attrType}
                                        deviceType={deviceType}
                                        deviceItem={deviceItem}
                                        setDeviceItem={setDeviceItem}
                                    />
                                </TableCell>
                            )
                        })}
                    </TableRow>
                )
            })}
        </>
    )
}