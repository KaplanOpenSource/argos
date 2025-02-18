import { writeFile } from 'fs/promises';
import { parse } from 'yaml';

const url = 'https://github.com/FortAwesome/Font-Awesome/raw/refs/heads/master/metadata/categories.yml';

const resp = await fetch(url);
const text = await resp.text();
const json = parse(text);
const code = 'export const icons = ' + JSON.stringify(json, undefined, 4);
await writeFile('icons.js', code);
