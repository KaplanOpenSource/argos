import { SCOPE_TRIAL } from "../../Experiment/AttributeType";
import { DevicesFromFile } from "./obtainDevicesFromFile";
import { ATTR_UNASSIGNED } from "./UploadDevicesTypeFieldsMatcher";

export const changeDeviceOnTrial = (
    trial: { devicesOnTrial: any[]; },
    experiment: { deviceTypes: any[]; },
    deviceToUpload: DevicesFromFile,
    attrMatch: { [key: string]: number; },
) => {
    const { type, name, MapName, Latitude, Longitude, attributes } = deviceToUpload;
    const deviceType = experiment?.deviceTypes?.find(x => x.name === type);
    if (deviceType) {
        trial.devicesOnTrial ||= [];
        let deviceOnTrial = trial.devicesOnTrial?.find(x => x.deviceTypeName === type && x.deviceItemName === name);
        if (!deviceOnTrial) {
            deviceOnTrial = { deviceTypeName: type, deviceItemName: name };
            trial.devicesOnTrial.push(deviceOnTrial);
        }

        deviceOnTrial.location = {
            "name": MapName,
            "coordinates": [
                parseFloat(Latitude),
                parseFloat(Longitude),
            ]
        }

        const attrMatchForType = Object.entries(attrMatch[deviceType.name]);
        for (const [attrNameOnDev, attrNameFromFile] of attrMatchForType) {
            if (attrNameFromFile || ATTR_UNASSIGNED !== ATTR_UNASSIGNED) {
                const attrType = deviceType?.attributeTypes?.find(x => x.name === attrNameOnDev);
                if (attrType && (attrType.scope || SCOPE_TRIAL) === SCOPE_TRIAL) {
                    const value = attributes[attrNameFromFile];
                    if (value || value === 0 || value === '') {
                        const attr = deviceOnTrial.attributes?.find(x => x.name === attrType.name);
                        if (attr) {
                            attr.value = value;
                        } else {
                            deviceOnTrial.attributes ||= [];
                            deviceOnTrial.attributes.push({ name: attrType.name, value });
                        }
                    }
                }
            }
        }
    }
}
