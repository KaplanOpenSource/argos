import { INamed } from "../types/types";

export function camelCaseToWords(s: string): string {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function createNewName(currentNamedItems: INamed[], nameTemplate: string, separator = ' '): string {
    if (!(currentNamedItems || []).find(t => t.name === nameTemplate)) {
        return nameTemplate;
    }
    for (let i = 1; ; ++i) {
        const cand = nameTemplate + separator + i;
        if (!currentNamedItems.find(t => t.name === cand)) {
            return cand;
        }
    }
}

export function replaceUrlParams(params: { [s: string]: any; }) {
    const u = new URL(window.location.href);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) {
            u.searchParams.set(k, v);
        } else {
            u.searchParams.delete(k);
        }
    }
    window.history.replaceState(null, '', u.href);
}

export function parseUrlParams(): { [s: string]: any; } {
    const u = new URL(window.location.href);
    const ret = {};
    for (const k of u.searchParams.keys()) {
        ret[k] = u.searchParams.get(k);
    }
    return ret;
}

export function changeByName(arr: INamed[] | undefined, name: string, newData: INamed): INamed[] {
    if (arr === undefined) {
        return [newData];
    }
    if (newData === undefined) {
        return arr.filter(t => t.name !== name);
    }
    const i = arr.findIndex(t => t.name === name);
    if (i === -1) {
        return [...arr, newData];
    }
    const theItems = [...arr];
    theItems[i] = newData;
    return theItems;
}

export const locationToString = (coords: number[]): string => {
    return coords.map(x => Math.round(x * 1e8) / 1e8).join(',')
}

export const arraySwapItems = (arr: any[], i0: number, i1: number): any[] => {
    arr[i0] = arr.splice(i1, 1, arr[i0])[0];
    return arr;
}

export function toTitleCase(str: string): string {
    return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
        return match.toUpperCase();
    });
}
