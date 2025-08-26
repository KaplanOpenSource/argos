import { IDeviceTypeAndItem } from "../types/types"

export const isSameDevice = (one: IDeviceTypeAndItem, two: IDeviceTypeAndItem) => {
  return one.deviceItemName === two.deviceItemName && one.deviceTypeName === two.deviceTypeName
}

export const isSameDeviceItem = (oneDeviceItemName: string, oneDeviceTypeName: string, two: IDeviceTypeAndItem) => {
  return oneDeviceItemName === two.deviceItemName && oneDeviceTypeName === two.deviceTypeName
}

export const findDevice = <T extends IDeviceTypeAndItem>(
  deviceList: T[],
  searchDevice: IDeviceTypeAndItem,
): T | undefined => {
  return deviceList.find(d => isSameDevice(d, searchDevice));
}

export const findDeviceIndex = (
  deviceList: IDeviceTypeAndItem[],
  searchDevice: IDeviceTypeAndItem,
): number => {
  return deviceList.findIndex(d => isSameDevice(d, searchDevice));
}

export const intersectDeviceLists = <T extends IDeviceTypeAndItem>(
  oneList: T[],
  twoList: IDeviceTypeAndItem[]
): T[] => {
  return oneList.filter(d => findDevice(twoList, d) !== undefined);
};

export const differenceDeviceLists = <T extends IDeviceTypeAndItem>(
  startList: T[],
  removeList: IDeviceTypeAndItem[],
): T[] => {
  return startList.filter(d => findDevice(removeList, d) === undefined);
}

export const unionDeviceLists = <T extends IDeviceTypeAndItem>(
  oneList: T[],
  twoList: T[],
): T[] => {
  return oneList.concat(differenceDeviceLists(twoList, oneList));
}
