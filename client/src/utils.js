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
