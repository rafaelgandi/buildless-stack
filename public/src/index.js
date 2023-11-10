// @ts-check
import './global.styles.js';
import { html, render } from 'preact-htm';
import Foobar from '@components/Foobar/Foobar.js'

function App() {
    return html`
        <${Foobar} greet="🎉 Hello World!" />
    `;
}

const main = document.querySelector('main');
render(html`<${App} />`, main);