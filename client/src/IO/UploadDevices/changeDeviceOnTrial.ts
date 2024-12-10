import { RealMapName } from "../../constants/constants";
import { SCOPE_TRIAL } from "../../Experiment/AttributeType";
import { FIELD_UNASSIGNED, FIELD_MAPNAME, FIELD_LATITUDE, FIELD_LONGITUDE } from "./uploadDefs";

export const changeDeviceOnTrial = (
    trial: { devicesOnTrial: any[]; },
    experiment: { deviceTypes: any[]; },
    deviceToUpload: { [key: string]: any },
    attrMatch: { [key: string]: number; },
) => {
    let { type, name, ...attributes } = deviceToUpload;
    type = type.trim();
    name = name.trim();
    const deviceType = experiment?.deviceTypes?.find(x => x.name === type);
    if (deviceType) {
        trial.devicesOnTrial ||= [];
        let deviceOnTrial = trial.devicesOnTrial?.find(x => x.deviceTypeName === type && x.deviceItemName === name);
        if (!deviceOnTrial) {
            deviceOnTrial = { deviceTypeName: type, deviceItemName: name };
            trial.devicesOnTrial.push(deviceOnTrial);
        }

        const attrMatchForType = attrMatch[deviceType.name];

        let MapName = RealMapName;
        if (attrMatchForType[FIELD_MAPNAME] !== FIELD_UNASSIGNED) {
            MapName = attributes[attrMatchForType[FIELD_MAPNAME]];
        }
        const Latitude = parseFloat(attributes[attrMatchForType[FIELD_LATITUDE]]);
        const Longitude = parseFloat(attributes[attrMatchForType[FIELD_LONGITUDE]]);

        if (!MapName || !isFinite(Latitude) || !isFinite(Longitude)) {
            throw "Unparsable location on device: " + JSON.stringify(deviceToUpload);
        }

        deviceOnTrial.location = {
            "name": MapName,
            "coordinates": [Latitude, Longitude]
        }

        for (const [attrNameOnDev, attrNameFromFile] of Object.entries(attrMatchForType)) {
            if (attrNameFromFile || FIELD_UNASSIGNED !== FIELD_UNASSIGNED) {
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
