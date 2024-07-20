# Buildless Stack
A tiny buildless stack for my frontend development.

<img src="https://lh3.googleusercontent.com/pw/ABLVV87U2nYPRXWvg5iDx2B1-U_rdiqAwEzOGAnQiNd19haAi7ppdJ4XiU1r71S8O4d9IYUPn0LI170ld_13u4JHaqW3Tj4RRTea04aEy2eISy8iDWVa6zccEs8cr9jNjQFWBFldAtRji_9vVYH71fVJLEgoag=w507-h507-s-no-gm?authuser=0" />

# Getting Started
Run the following command to get a boilerplate copy.
``` shell
git clone https://github.com/rafaelgandi/buildless-stack.git buildless-$(date +"%Y%m%d") && cd buildless-$(date +"%Y%m%d") && rm -rf .git
```

# UI Library
I use [Preact](https://preactjs.com/) for declarative UI programming and [HTM](https://github.com/developit/htm) as a buildless alternative to JSX. The combined standalone version used in this stack can be found [here.](https://preactjs.com/guide/v10/getting-started/#no-build-tools-route)

# UI Component Library
I use [Shoelace](https://shoelace.style/) for UI components. I use the shoelace.js script directly in the browser. Current version used is 2.15.1.


# CSS Styling
I use [postcss-nesting](https://github.com/csstools/postcss-nesting) built with [esm.sh cdn](https://esm.sh/) as a polyfill for native nested css if it is not supported by a browser. [styled.js](https://github.com/rafaelgandi/buildless-stack/blob/main/public/src/lib/styled.js) is the utility function I made to make this easier to use.


# Types
Since I can't directly annotate my code with Typescript types. I just make a single file(```types.d.ts```) where I place all my Typescript type declarations and reference them using [JSDoc's import syntax](https://stackoverflow.com/questions/49836644/how-to-import-a-typedef-from-one-file-to-another-in-jsdoc-using-node-js). This way I somewhat get type autocomplete suggestions in VSCode.

But... lets face it, the jsdoc syntax for typing is not very intuitive. So I came up with a way to annotate types to my preact components. I just add a js template literal to the top of my component function where I place the typescript type declarations. I use [Matt Bierner's Comment tagged templates](https://marketplace.visualstudio.com/items?itemName=bierner.comment-tagged-templates) vscode extension to get the typescript syntax highlighting in VSCode. It does not really do any type checking but I usually use it to be just a reference anyway.

<img src="https://lh3.googleusercontent.com/pw/AP1GczPk7q3T4qg2qGr9OFeavWwlpN-eF1t216T6d27y_Fh5P6YbFynHRGvvQKsJYLUKOKfKeVLkoswaAmL6hRUJiyrk2JfEOlV6yBwS6uogBZFTfLWPS0H1LehfGOJMc8J8R-G7SXGTxmiBk5BDgKN-Un2_dg=w798-h388-s-no-gm?authuser=0" />



# Import Maps
I use import map to alias some library script that I use. So I don't have to constantly type out their paths. For browsers that don't yet support import maps I use this [shim.](https://github.com/guybedford/es-module-shims#import-maps)


# Finding packages
Since I don't use a bundler in this stack I need a way to consume npm packages in the browser directly. The service that I found useful for this is [jsdelivr.com](https://www.jsdelivr.com/). I just search for the npm package name in the service and it will generate a cdn link I can use to reference directly or save it as a local file. Make sure to choose the ESM version.
You can also use [this tool](https://esm.sh/)(esm.sh) in generating es modules for the browser. It's also good to check if a package has dependecies by using [this tool](https://bundlephobia.com/)(Bundle Phobia).

# VSCode Extensions
Make sure to install the official [lit-html extension](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) and the [styled-component extension](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components) for proper syntax highlighting.

# Installing Dev Dependencies
This stack has a few dev dependencies for developer convenience like js linting but is not really necessary.
```javascript
// 🥟 For bun environment
bun install
```


# Running a Local Dev Server
I use Bun as a package manager but any package manager is fine.
```javascript
// 🥟 For bun environment
bun dev

// For node with Yarn
yarn dev

// For node with NPM
npm run dev
```
Or you can just install [🍯 Simple Web Server](https://simplewebserver.org/) macos app for a standalone web server app.

# Additional Resources
- https://hackernoon.com/front-end-development-without-node_modules-using-skypack-and-snowpack-s03n33mk
- https://zellwk.com/blog/node-modules-in-frontend-without-bundlers/
- https://jvns.ca/blog/2023/02/16/writing-javascript-without-a-build-system/
- https://tailwindcss.com/blog/standalone-cli   (standalone tailwind) 
- https://medium.com/@canadaduane/switching-to-no-compile-step-typescript-67650a3866a6
- https://unsuckjs.com/
- https://tone-row.com/blog/typescript-in-javascript-with-comments
- https://stackoverflow.com/questions/68675994/what-is-jsconfig-json  (vscode helper file “jsconfig.json”)
- https://mtsknn.fi/blog/jsx-vs-htm-hyperscript-tagged-markup/
- https://simplewebserver.org/
- https://gomakethings.com/articles/
