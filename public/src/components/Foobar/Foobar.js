
import { html } from 'preact-htm';
import './Foobar.styles.js';


/** @param {import("/public/types.d.ts").FoobarProps} props */
export default function Foobar(props) {
    return html`
        <div class="foobar">${props.greet}</div>
    `;
}




/* * @param {import("../../types.d.ts").FoobarProps} props */