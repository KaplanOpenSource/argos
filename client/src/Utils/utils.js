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
        u.searchParams.set(k, v);
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