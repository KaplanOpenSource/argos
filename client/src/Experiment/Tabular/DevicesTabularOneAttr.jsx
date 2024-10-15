import { AttributeItemOne } from "../AttributeItemList";
import { SCOPE_EXPERIMENT, SCOPE_TRIAL } from "../AttributeType";
import { useContext } from "react";
import { experimentContext } from "../../Context/ExperimentProvider";

export const DevicesTabularOneAttr = ({ attrType, deviceItem, deviceType, setDeviceItem }) => {
    const { currTrial, setTrialData } = useContext(experimentContext);

    if ((!attrType?.scope) || attrType.scope === SCOPE_TRIAL) {
        const devicesOnTrial = currTrial?.trial?.devicesOnTrial;
        const devindex = (devicesOnTrial || []).findIndex(t => {
            return t.deviceItemName === deviceItem.name && t.deviceTypeName === deviceType.name;
        });

        if (devindex !== -1) {
            const deviceOnTrial = devicesOnTrial[devindex];
            const setDeviceOnTrial = newDeviceData => {
                const data = { ...currTrial.trial, devicesOnTrial: [...devicesOnTrial] };
                data.devicesOnTrial[devindex] = newDeviceData;
                setTrialData(data);
            };

            return (
                <AttributeItemOne
                    attrType={attrType}
                    data={deviceOnTrial}
                    setData={setDeviceOnTrial}
                    scope={SCOPE_TRIAL}
                    deviceItem={deviceItem}
                    reduceNames={true}
                />
            )
        }
    }

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