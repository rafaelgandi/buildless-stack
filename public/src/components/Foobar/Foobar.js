import { html } from 'preact-htm';
import './Foobar.styles.js';

/** @param {import("./Foobar.d.ts").FoobarProps} props */
export default function Foobar(props) {
    return html`
       <>
            <h1 class="_26c1c2a7">
                ${props.greet}
                <sub>buildless-stack at your service</sub>
            </h1>
            <div style=${{textAlign: 'center'}}>
                <sl-badge variant="primary" pulse pill>Primary</sl-badge>
                <sl-badge variant="success" pulse pill>Success</sl-badge>
                <sl-badge variant="neutral" pulse pill>Neutral</sl-badge>
                <sl-badge variant="warning" pulse pill>Warning</sl-badge>
                <sl-badge variant="danger" pulse pill>Danger</sl-badge>
            </div>
            
        </>
    `;
}
