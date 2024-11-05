// Import necessary modules
const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom'); // Use JSDOM to manipulate HTML in Node

// Function to clean HTML file by removing elements matching an array of selectors
function cleanHTMLFile(filePath, selectorsToRemove) {
    // Read the HTML file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }

        // Parse HTML content with JSDOM
        const dom = new JSDOM(data);
        const document = dom.window.document;

        // Loop through each selector and remove matching elements
        selectorsToRemove.forEach(selector => {
            const elementsToRemove = document.querySelectorAll(selector);
            elementsToRemove.forEach(element => element.remove());
        });

        // Get the updated HTML content
        const updatedHTML = dom.serialize();

        // Write the cleaned HTML back to the file
        fs.writeFile(filePath, updatedHTML, (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`);
                return;
            }
            console.log(`File successfully updated. Removed elements matching selectors: ${selectorsToRemove.join(', ')}`);
        });
    });
}

// Usage: specify the path to the HTML file and an array of selectors to remove
const filePath = path.join(__dirname, 'input.html'); // Replace 'content.html' with your HTML file
const selectorsToRemove = ['svg']; // Add your selectors here
cleanHTMLFile(filePath, selectorsToRemove);
