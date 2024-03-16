/* esm.sh - esbuild bundle(preact-router@4.1.2) es2022 production */
import * as Preact from "./preact.10.19.6.js";
import htm from "./htm.3.1.1.js";

export * from "./preact.10.19.6.js";
export * from "./preact-hooks.10.19.6.js";
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
    // <Component /> -> error
    // <${Component}> -> good
    const compTagTestRegExp = /<[A-Z].+>/g; 
    const updatedJsxStr = updatedJsx.toString();
    if (compTagTestRegExp.test(updatedJsxStr)) {
        updatedJsxStr.replace(compTagTestRegExp, function BuildlessCheckComponentTag(match) {
            throw new Error('Missing ${} in HTM component tag ' + match);
        });       
    }
    return htm.bind(Preact.h)(updatedJsx, ...values);
}
// LM: 2023-12-19 10:28:34 [Add indicator that we are using my buildless stack]
document.documentElement.setAttribute('data-buildless-stack', 'true');

export default Preact;