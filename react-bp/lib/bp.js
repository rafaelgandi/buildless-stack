/*
    Used to generate component boilerplates for SolidJS components
    www.rafaelgandi.com
*/
const { writeFileSync, existsSync, mkdirSync } = require('fs');
// See: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
const args = process.argv.slice(2);
const componentName = args[1];
if (!componentName) {
    throw new Error('Please provide a name for the component.');
}
const passedPath = args?.[0];
const srcDir = (!!passedPath && passedPath !== 'null') ? (passedPath + '/') : './';
const componentDir = srcDir + componentName;
console.log('🚧 Building...');
if (!existsSync(componentDir)) {
    mkdirSync(componentDir);
}

function generateRandomString(length) {
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
        randomString += alphanumericChars[randomIndex];
    }
    return '_' + randomString;
}

const cssClassNameStr = generateRandomString(8);


const componentCodeTemplate = `
import { html } from 'preact-htm';
import './${componentName}.styles.js';

/* * @param {import("../../types.d.ts").${componentName}Props} props */
export default function ${componentName}(props) {
    return html\`
        <div class="${cssClassNameStr}"></div>
    \`;
}
`;

const componentStylesTemplate = `
import styled from 'styled';
export default styled\`
    .${cssClassNameStr} {
        
    }
\`;
`;

writeFileSync(`${componentDir}/${componentName}.js`, componentCodeTemplate);
writeFileSync(`${componentDir}/${componentName}.styles.js`, componentStylesTemplate);

console.log(`|-- ${componentDir}/${componentName}.js`);
console.log(`|-- ${componentDir}/${componentName}.styles.js`);
console.log(`Component boilerplate created! 🤖✨`);