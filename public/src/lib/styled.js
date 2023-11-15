
const $head = document.querySelector('head');
const $body = document.querySelector('body');
const isNestedCssSupported = (() => {
    const style = document.createElement('style');
    style.setAttribute('id', 'nestcss-test');
    style.textContent = `#nestcss-cont-test { & div { content: 'hello-css-nesting'; }}`;
    style.setAttribute('type', 'text/css');
    const div = document.createElement('div');
    div.id = 'nestcss-cont-test';
    div.innerHTML = '<div></div>';
    $head.appendChild(style);
    $body.appendChild(div);
    const con = getComputedStyle(div.querySelector('div')).content;
    style.remove();
    div.remove();
    return con.includes('hello-css-nesting');
})();


export default async function styled(strings, ...values) {
    const css = strings.reduce((result, string, index) => {
        return result + string + (values[index] || '');
    }, '');
    let cssStyles = css;
    if (!isNestedCssSupported) {
        // Use polyfill if css nesting is not supported.
        // See: https://github.com/csstools/postcss-nesting
        const postcss = await import('https://esm.sh/postcss@8.4.31');
        const postcssNesting = await import('https://esm.sh/postcss-nesting@12.0.1');
        cssStyles = await postcss.default([postcssNesting.default]).process(cssStyles /*, processOptions */);
    } 
    const style = document.createElement('style');
    style.setAttribute('data-generated', 'true');
    style.textContent = cssStyles;
    style.setAttribute('type', 'text/css');
    $head.appendChild(style);
    return cssStyles;
}