
// Define SelectionType as an enum
export const SelectionType = Object.freeze({
    SINGLE: "single",
    MULTIPLE: "multiple",
});

export const EngineType = Object.freeze({
    FOOTY: "footy",
    Winamax: "winamax",
});

export class PanelSelector {
    constructor(selector, nameIdentifier, selectionType = SelectionType.SINGLE) {
        this.selector = selector;
        this.nameIdentifier = nameIdentifier;
        this.selectionType = selectionType;
    }

    // Method to find a single element
    findElement() {
        return document.querySelector(this.selector);
    }

    // Method to find multiple elements
    findElements() {
        return document.querySelectorAll(this.selector);
    }

    // Method to log an error if the element(s) are not found
    logErrorIfNotFound() {
        console.error(`Element(s) not found: ${this.nameIdentifier}`);
    }

    // Poll for elements and apply a callback once they are found
    pollForElements(callback) {
        const interval = setInterval(() => {
            const elements =
                this.selectionType === SelectionType.SINGLE
                    ? [this.findElement()]
                    : Array.from(this.findElements());

            // Filter out null entries in case of single selection with no element found
            const validElements = elements.filter((element) => element !== null);

            if (validElements.length > 0) {
                // Call the callback on each found element
                validElements.forEach((element) => callback(element));

                // Clear the interval once elements are found and processed
                clearInterval(interval);
            } else {
                // Log error if no elements are found
                this.logErrorIfNotFound();
            }
        }, 500); // Check every 500ms
    }
}