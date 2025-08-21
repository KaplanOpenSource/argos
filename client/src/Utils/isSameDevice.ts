import { IDeviceTypeAndItem } from "../types/types"

export const isSameDevice = (one: IDeviceTypeAndItem, two: IDeviceTypeAndItem) => {
  return one.deviceItemName === two.deviceItemName && one.deviceTypeName === two.deviceTypeName
}

export const isSameDeviceItem = (oneDeviceItemName: string, oneDeviceTypeName: string, two: IDeviceTypeAndItem) => {
  return oneDeviceItemName === two.deviceItemName && oneDeviceTypeName === two.deviceTypeName
}

