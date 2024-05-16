export const consoleErrorUniqueKeyFix = () => {
    console.oldError = console.error;

    console.error = function (...args) {
        if (!args[0].startsWith("Warning: Each child in a list should have a unique")) {
            console.oldError(...args);
        } else {
            const lines = args[1].split('\n')
                .filter(x => !x.startsWith("node_modules/"))
                .map(x => {
                    const tokens = x.split('@');
                    if (tokens.length <= 1) {
                        return '....html: ' + tokens.join('');
                    }
                    if (tokens[1].includes('node_modules')) {
                        return '....node: ' + tokens[0];
                    }
                    let rest = tokens.slice(1).join('@');
                    const tpos = rest.indexOf('?t=');
                    rest = tpos === -1 ? rest : rest.substring(0, tpos);
                    const hpos = rest.indexOf(location.origin);
                    rest = hpos === -1 ? rest : rest.substring(location.origin.length + 1);
                    return tokens[0] + ' @ ' + rest;
                });
            console.oldError(args[0], lines.join('\n'), ...args.slice(2))
        }
    }
}