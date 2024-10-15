import { TableCell, TableRow } from "@mui/material";
import { AttributeItemOne } from "../AttributeItemList";
import { SCOPE_EXPERIMENT, SCOPE_TRIAL } from "../AttributeType";
import { useContext } from "react";
import { experimentContext } from "../../Context/ExperimentProvider";

const DevicesTabularOneAttr = ({ attrType, deviceItem, deviceType, setDeviceItem }) => {
    const { currTrial } = useContext(experimentContext);
    const devicesOnTrial = currTrial?.trial?.devicesOnTrial;
    const deviceOnTrial = devicesOnTrial?.find(t => {
        return t.deviceItemName === deviceItem.name && t.deviceTypeName === deviceType.name;
    });

    // console.log(deviceItem.name, deviceOnTrial, attrType, devicesOnTrial)
    if (deviceOnTrial && ((!attrType?.scope) || attrType.scope === SCOPE_TRIAL)) {
        return (
            <AttributeItemOne
                attrType={attrType}
                data={deviceOnTrial}
                // setData={setDeviceOnTrial}
                scope={SCOPE_TRIAL}
                deviceItem={deviceItem}
                reduceNames={true}
            />
        )
    } else {
        return (
            <AttributeItemOne
                attrType={attrType}
                data={deviceItem}
                setData={val => setDeviceItem(val)}
                scope={SCOPE_EXPERIMENT}
                reduceNames={true}
            />
        )
    }
}

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