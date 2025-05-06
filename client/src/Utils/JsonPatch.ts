import * as jsonpatch from 'fast-json-patch';

export type JsonOperationPack = jsonpatch.Operation[];

export const jsonCompare = (
  prevData: any,
  newData: any,
): JsonOperationPack => {
  const prevDataArr = [prevData].filter(x => x);
  const newDataArr = [newData].filter(x => x);
  const patch = jsonpatch.compare(prevDataArr, newDataArr);
  patch.sort((a, b) => a.op !== b.op ? a.op.localeCompare(b.op) : a.path.localeCompare(b.path));
  return patch;
}

export const jsonApplyItem = (
  itemsToBeChanged: any[],
  index: number,
  prevData: any,
  patchArr: readonly jsonpatch.Operation[],
): any => {
  const prevDataArr = [prevData].filter(x => x);
  const newData = jsonpatch.applyPatch(prevDataArr, patchArr, false, false).newDocument[0];
  if (newData && index === -1) {
    itemsToBeChanged.push(newData);
  } else if (newData && index !== -1) {
    itemsToBeChanged[index] = newData;
  } else if (!newData && index !== -1) {
    itemsToBeChanged.splice(index, 1);
  }
  return newData;
}

