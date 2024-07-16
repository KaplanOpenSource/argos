export const SaveFile = (contents, filename, type = 'text/plain') => {
    const blob = new Blob([contents], { type })
    saveAs(blob, filename);
}

export const SaveJson = (json, filename, type = 'application/json') => {
    SaveFile(JSON.stringify(json, null, 2), filename, type);
}
