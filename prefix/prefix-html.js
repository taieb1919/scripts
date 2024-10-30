const fs = require('fs');

const prefix = 'your-prefix-'; // Same prefix as in PostCSS config
const htmlFile = 'src/index.html';
const outputHtmlFile = 'dist/index.prefixed.html';

// Read the HTML file
let htmlContent = fs.readFileSync(htmlFile, 'utf8');

// Add prefix to each class name
htmlContent = htmlContent.replace(/class="([^"]*)"/g, (match, classNames) => {
    const prefixedClassNames = classNames.split(' ').map(cls => `${prefix}${cls}`).join(' ');
    return `class="${prefixedClassNames}"`;
});

// Write the updated content to a new file
fs.writeFileSync(outputHtmlFile, htmlContent);

console.log(`Prefixed HTML saved to ${outputHtmlFile}`);
