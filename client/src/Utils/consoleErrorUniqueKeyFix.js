export const consoleErrorUniqueKeyFix = () => {
    console.oldError = console.error;

    console.error = function (...args) {
        if (typeof args[0] !== 'string') {
            console.oldError(...args);
        } else if (!(args[0] || '').startsWith("Warning: Each child in a list should have a unique")) {
            console.oldError(...args);
        } else {
            const raw = args.slice(1).join('\n').split('\n').map(x => x.trim());
            const lines = [args[0].replaceAll("%s", "")];
            for (const x of raw) {
                if (!x || x.startsWith("node_modules/")) {
                    continue;
                }
                if (x.startsWith('Check the render method of')) {
                    lines.push(x);
                } else {
                    const tokens = x.split('@');
                    if (tokens.length <= 1) {
                        lines.push('....html: ' + tokens.join(''));
                    } else if (tokens[1].includes('node_modules')) {
                        lines.push('....node: ' + tokens[0])
                    } else {
                        let rest = tokens.slice(1).join('@');
                        const tpos = rest.indexOf('?t=');
                        rest = tpos === -1 ? rest : rest.substring(0, tpos);
                        const hpos = rest.indexOf(location.origin);
                        rest = hpos === -1 ? rest : rest.substring(location.origin.length + 1);
                        lines.push(tokens[0] + ' @ ' + rest);
                    }
                }
            }
            console.oldError(lines.join('\n'))
        }
    }
}