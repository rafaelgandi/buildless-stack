/* esm.sh - esbuild bundle(preact-router@4.1.2) es2022 production */
import * as Preact from"./preact.js";
import htm from "./htm.js";

export * from "./preact.js";
export * from"./hooks.js";
// export const html = htm.bind(Preact.h);

export function html(strings, ...values) {
    const updatedJsx = strings.map((string) => {
        // Allow Fragment support. //
        if (string.includes('<>') || string.includes('</>')) {
            return string.replace('<>', '').replace('</>', '');
        }
        return string;
    });
    return htm.bind(Preact.h)(updatedJsx, ...values);
}
export default Preact;