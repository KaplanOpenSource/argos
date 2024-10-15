import * as jsonpatch from 'fast-json-patch';

export const jsonCompare = (
    prevData: any,
    newData: any,
): jsonpatch.Operation[] => {
    const prevDataArr = [prevData].filter(x => x);
    const newDataArr = [newData].filter(x => x);
    return jsonpatch.compare(prevDataArr, newDataArr);
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

