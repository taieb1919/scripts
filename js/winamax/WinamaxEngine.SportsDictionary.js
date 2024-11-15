
// SportsDictionary Helper

class SportsDictionary {
    // Private static variable to hold the dictionary
    static #dictionary;

    // Public getter to access (and initialize) the dictionary
    static get dictionary() {
        if (!this.#dictionary) {
            // Initialize the dictionary with values on first access
            this.#dictionary = this.#BuildDictionary();
        }
        return this.#dictionary;
    }


    static #BuildDictionary() {


        const selector = 'div[data-testid="leftColumn"]';
        const leftMenuSportList = document.querySelector(selector);

        if (leftMenuSportList) {

            const sportsDiv = this.#GetSportDiv(leftMenuSportList);
            if (sportsDiv) {

                const elementsToRemove = sportsDiv.querySelectorAll('.CollapseListItem-collapse');
                // Iterate over the NodeList and remove each element from the DOM
                elementsToRemove.forEach(element => element.remove());

                const links = sportsDiv.querySelectorAll('a');


                return this.#GetSportsDictionary(links);
            }

        } else {
            console.log('Element found: for selector  {selector} ');
        }

        return null;
    }


    static #GetSportsDictionary = links => {


        // Initialize an empty dictionary
        const dictionary = {};

        // Loop through each <a> element
        links.forEach(link => {
            // Get the div elements inside the <a>
            const divs = link.querySelectorAll('div');

            // Check if there are at least two <div> elements in the <a> (one before the text, one with the text)
            if (divs.length >= 2) {
                // The first <div> has the class value we want
                const classValue = divs[0].className;

                // The second <div> contains the text content (e.g., "Football")
                const key = divs[1].textContent.trim();

                // Add to the dictionary
                dictionary[key] = classValue;
            }
        });

        // Step 1: Split each class string and collect all class names
        const allClasses = Object.values(dictionary).map(value => value.split(' '));

        // Step 2: Find the intersection of all class arrays (common classes)
        const commonClasses = allClasses.reduce((acc, classes) => {
            return acc.filter(className => classes.includes(className));
        });


        // Step 3: Create a new dictionary with inverted key-value pairs
        const invertedData = {};

        for (const [key, classString] of Object.entries(dictionary)) {
            // Filter out the common classes
            const variantClasses = classString
                .split(' ')
                .filter(className => !commonClasses.includes(className))
                .join(' ');

            // Invert the key and value for the new dictionary
            invertedData[variantClasses] = key;
        }


        return invertedData;
    };


    static #GetSportDiv(leftPanel) {
        // Target text to search for
        const targetText = "Sports";

        // Select all <div> elements
        const divs = leftPanel.querySelectorAll('div');

        let parentDiv = null; // Variable to store the parent div

        // Loop through each div to check if it contains the target text
        divs.forEach(div => {
            if (div.textContent.trim() === targetText) {
                parentDiv = div; // Assign the parent div
                return; // Exit the loop once found
            }
        });

        if (parentDiv) {
            console.log("Parent div found:", parentDiv.parentElement);
            return parentDiv.parentElement;
        } else {
            console.log("No div with the specified text found.");
            return null;
        }
    }

    // Static method to find sports based on classes in an input string
    static findSportsByClassList(classList) {
        // Split the input class list into individual class names
        const classArray = classList instanceof DOMTokenList
            ? Array.from(classList)
            : Array.isArray(classList)
                ? classList
                : classList.split(' ');

        // Find the first matching sport name in the dictionary
        const firstMatchedSport = classArray.find(className => this.dictionary[className] !== undefined);

        // Return the first matched sport name (or undefined if none is found)
        let result = firstMatchedSport ? this.dictionary[firstMatchedSport] : undefined;

        console.log(this.dictionary);
        console.log(classArray);

        console.log(`found a result in Sports dictionary : ${result}   for class list ${classArray}`);
        return result;
    }
}
