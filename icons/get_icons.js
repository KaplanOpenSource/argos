import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'yaml';

const url = 'https://github.com/FortAwesome/Font-Awesome/raw/refs/heads/master/metadata/categories.yml';

const resp = await fetch(url);
const text = await resp.text();
const json = parse(text);
const code = 'export const iconsCategories = ' + JSON.stringify(json, undefined, 4);

const filename = resolve('../client/src/Icons/iconsCategories.js');
console.log('writing icons to', filename);
await writeFile(filename, code);
console.log('done.');
