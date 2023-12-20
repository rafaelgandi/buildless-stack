import { html } from 'preact-htm';
import './Foobar.styles.js';

/** @param {import("./Foobar.d.ts").FoobarProps} props */
export default function Foobar(props) {
    return html`
        <h1 class="_26c1c2a7">
            ${props.greet}
            <sub>buildless-stack at your service</sub>
        </h1>
    `;
}
