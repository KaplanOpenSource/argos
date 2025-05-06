import { saveAs } from 'file-saver';

export const SaveFile = (contents, filename, type = 'text/plain') => {
  const blob = new Blob([contents], { type })
  saveAs(blob, filename);
}

export const SaveJson = (json, filename, type = 'application/json') => {
  SaveFile(JSON.stringify(json, null, 2), filename, type);
}

export const ReadFileAsText = async (file) => {
  const text = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsText(file);
  });
  return text;
}