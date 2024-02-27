export function camelCaseToWords(s) {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function createNewName(currentNamedItems, nameTemplate, separator = ' ') {
    if (!currentNamedItems.find(t => t.name === nameTemplate)) {
        return nameTemplate;
    }
    for (let i = 1; ; ++i) {
        const cand = nameTemplate + separator + i;
        if (!currentNamedItems.find(t => t.name === cand)) {
            return cand;
        }
    }
}

export function replaceUrlParams(params) {
    const u = new URL(window.location);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) {
            u.searchParams.set(k, v);
        } else {
            u.searchParams.delete(k);
        }
    }
    window.history.replaceState(null, null, u.href);
}

export function parseUrlParams() {
    const u = new URL(window.location);
    const ret = {};
    for (const k of u.searchParams.keys()) {
        ret[k] = u.searchParams.get(k);
    }
    return ret;
}

export function downloadJsonFile(filename, jsonData) {
    const element = document.createElement("a");
    const textFile = new Blob([JSON.stringify(jsonData)], { type: 'text/plain' });
    element.href = URL.createObjectURL(textFile);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export function changeByName(arr, name, newData) {
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

export function splitLast(arr) {
    if (!arr || !arr.length) {
        return [arr, undefined];
    }
    return [arr.slice(0, -1), arr.at(-1)];
}