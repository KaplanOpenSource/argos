import { IDeviceTypeAndItem } from "../types/types"

export const isSameDevice = (one: IDeviceTypeAndItem, two: IDeviceTypeAndItem) => {
    return one.deviceItemName === two.deviceItemName && one.deviceTypeName === two.deviceTypeName
}

