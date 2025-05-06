import { v4 as uuidv4 } from 'uuid';

export const assignUuids = (data) => { //, prevPath = "") => {
    if (data && typeof data === 'object') {
        if (data.forEach) {
            data.forEach(item => assignUuids(item));//, prevPath));
        } else {
            if (data.name) {
                if (!data.trackUuid) {
                    data.trackUuid = uuidv4();
                    // data.trackPath = (prevPath && (prevPath + '/')) + data.name;
                }
                for (const [key, value] of Object.entries(data)) {
                    assignUuids(value);//, data.path);
                }
            }
        }
    }
    return data;
}

export const cleanUuids = (data) => {
    if (!data || typeof data !== 'object') {
        return data;
    }
    if (data.map) {
        return data.map(item => cleanUuids(item));
    }
    const ret = {};
    for (const [key, value] of Object.entries(data)) {
        if (key !== 'trackUuid') {
            ret[key] = cleanUuids(value);
        }
    }
    return ret;
}