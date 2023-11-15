/* esm.sh - esbuild bundle(preact-router@4.1.2) es2022 production */
import * as Preact from"./preact.js";
import htm from "./htm.js";

export * from "./preact.js";
export * from"./hooks.js";
export const html = htm.bind(Preact.h);
export default Preact;