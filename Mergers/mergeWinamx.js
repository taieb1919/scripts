const fs = require('fs');
const path = require('path');

const files = [
    '../js/alerts.js',
    '../js/commons.js',
    '../js/kernel.js',
    '../js/modal.js',
    '../js/winamax/WinamaxEngine.js',


]; // List of JavaScript files to merge
const output = '../js/Winamax.js';

// Read each file's content and join them with a newline
const content = files.map(file => fs.readFileSync(path.join(__dirname, file), 'utf-8')).join('\n');


const cleanedContent = content.replace(/\uFEFF/g, '');
// Write the concatenated content to the output file
fs.writeFileSync(output, cleanedContent);

console.log(`Merged files into ${output}`);
