/* esm.sh - esbuild bundle(preact-router@4.1.2) es2022 production */
import * as Preact from "./preact.js";
import htm from "./htm.js";

export * from "./preact.js";
export * from "./hooks.js";
// export const html = htm.bind(Preact.h);

export function html(strings, ...values) {
    const updatedJsx = strings.map((string) => {
        // Allow Fragment support. //
        if (string.includes('<>') || string.includes('</>')) {
            return string.replace('<>', '').replace('</>', '');
        }
        return string;
    });
    // LM: 2023-12-17 10:37:25 [Add a way to check for component tags without ${}]
    const compTagTestRegExp = /<[A-Z].+>/g;
    const updatedJsxStr = updatedJsx.toString();
    if (compTagTestRegExp.test(updatedJsxStr)) {
        updatedJsxStr.replace(compTagTestRegExp, function BuildlessCheckComponentTag(match) {
            throw new Error('Missing ${} in HTM component tag ' + match);
        });       
    }
    return htm.bind(Preact.h)(updatedJsx, ...values);
}
export default Preact;