import { TableCell, TableRow } from "@mui/material";
import { AttributeItemOne } from "../AttributeItemList";
import { SCOPE_EXPERIMENT } from "../AttributeType";

export const DevicesTabularOneDevice = ({ deviceType, setDeviceType }) => {
    return (
        <>
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
        </>
    )
}