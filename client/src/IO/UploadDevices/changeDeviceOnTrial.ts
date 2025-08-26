import { RealMapName } from "../../constants/constants";
import { ScopeEnum } from '../../types/ScopeEnum';
import { FIELD_LATITUDE, FIELD_LONGITUDE, FIELD_MAPNAME, FIELD_NAME, FIELD_TYPE, FIELD_UNASSIGNED } from "./uploadDefs";

export const changeDeviceOnTrial = (
  trial: { devicesOnTrial: any[]; },
  experiment: { deviceTypes: any[]; },
  deviceToUpload: { [key: string]: any },
  attrMatch: { [key: string]: number; },
) => {
  const type = deviceToUpload[attrMatch[FIELD_TYPE]].trim();
  const name = deviceToUpload[attrMatch[FIELD_NAME]].trim();
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
      MapName = deviceToUpload[attrMatchForType[FIELD_MAPNAME]];
    }
    const Latitude = parseFloat(deviceToUpload[attrMatchForType[FIELD_LATITUDE]]);
    const Longitude = parseFloat(deviceToUpload[attrMatchForType[FIELD_LONGITUDE]]);

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
        if (attrType && (attrType.scope || ScopeEnum.SCOPE_TRIAL) === ScopeEnum.SCOPE_TRIAL) {
          const value = deviceToUpload[attrNameFromFile];
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
