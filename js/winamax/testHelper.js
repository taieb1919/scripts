import {promises as fs} from 'fs'; // Use fs.promises to work with promises
import {JSDOM} from 'jsdom';

// Function to load local HTML content from a file path and return it as a DocumentFragment
export async function loadExternalHTMLFromFile(filePath) {
    try {
        // Read the file content as text
        const htmlContent = await fs.readFile(filePath, 'utf-8');

        // Parse the HTML content using JSDOM
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;

        // Create a DocumentFragment to hold the content
        const fragment = document.createDocumentFragment();

        // Append the parsed document's body content to the fragment
        fragment.append(...document.body.childNodes);

        return fragment; // Return the DocumentFragment
    } catch (error) {
        console.error('Error loading HTML from file:', error);
        throw error;
    }
}
