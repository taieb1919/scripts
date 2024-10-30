const fs = require('fs');
const {postfix} = require('./config');

const htmlFile = 'src/index.html';
const outputHtmlFile = 'dist/index.postfixed.html';

// Read the HTML file
let htmlContent = fs.readFileSync(htmlFile, 'utf8');

// Add postfix to each class name
htmlContent = htmlContent.replace(/class="([^"]*)"/g, (match, classNames) => {
    const postfixedClassNames = classNames.split(' ').map(cls => `${cls}${postfix}`).join(' ');
    return `class="${postfixedClassNames}"`;
});

// Write the updated content to a new file
fs.writeFileSync(outputHtmlFile, htmlContent);

console.log(`Postfixed HTML saved to ${outputHtmlFile}`);
