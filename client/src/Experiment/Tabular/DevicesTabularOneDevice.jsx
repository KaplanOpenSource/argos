import { TableCell, TableRow } from "@mui/material";
import { DevicesTabularOneAttr } from "./DevicesTabularOneAttr";
import { useContext } from "react";
import { experimentContext } from "../../Context/ExperimentProvider";
import { TextFieldDebounceOutlined } from "../../Utils/TextFieldDebounce";

const NumberCoordField = ({ value, setValue, label }) => {
    return (
        <TextFieldDebounceOutlined
            label={label}
            type="number"
            value={Math.round(value * 1e8) / 1e8}
            onChange={v => {
                const n = parseFloat(v);
                if (isFinite(n)) {
                    setValue(n);
                }
            }}
        />
    )
}

export const DevicesTabularOneDevice = ({ deviceType, setDeviceType }) => {
    const { currTrial, setLocationsToDevices } = useContext(experimentContext);

    const devicesOnTrial = currTrial?.trial?.devicesOnTrial;

    return (
        <>
            {deviceType?.devices?.map((deviceItem, itr) => {
                const setDeviceItem = (val) => {
                    const t = structuredClone(deviceType);
                    t.devices[itr] = val;
                    setDeviceType(t);
                }

                const deviceOnTrial = devicesOnTrial?.find(t => {
                    return t.deviceItemName === deviceItem.name && t.deviceTypeName === deviceType.name;
                });

                return (
                    <TableRow
                        key={deviceItem.trackUuid}
                    >
                        <TableCell component="th" scope="row" key={':tt'}>
                            {deviceType.name}
                        </TableCell>
                        <TableCell key={':tr'}>
                            {deviceItem.name}
                        </TableCell>
                        <TableCell key={':tlat'}>
                            {deviceOnTrial?.location?.coordinates?.length === 2
                                ? <NumberCoordField
                                    label={'Latitude'}
                                    value={deviceOnTrial?.location?.coordinates[0]}
                                    setValue={v => {
                                        setLocationsToDevices(
                                            [{ deviceItemName: deviceItem.name, deviceTypeName: deviceType.name }],
                                            [[v, deviceOnTrial?.location?.coordinates[1]]]);
                                    }}
                                />
                                : null}
                        </TableCell>
                        <TableCell key={':tlng'}>
                            {deviceOnTrial?.location?.coordinates?.length === 2
                                ? <NumberCoordField
                                    label={'Longitude'}
                                    value={deviceOnTrial?.location?.coordinates[1]}
                                    setValue={v => {
                                        setLocationsToDevices(
                                            [{ deviceItemName: deviceItem.name, deviceTypeName: deviceType.name }],
                                            [[deviceOnTrial?.location?.coordinates[0], v]]);
                                    }}
                                />
                                : null}
                        </TableCell>
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