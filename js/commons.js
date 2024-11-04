// Define SelectionType as an enum   asdsad 
const SelectionType = Object.freeze({
    SINGLE: "single",
    MULTIPLE: "multiple",
});

const EngineType = Object.freeze({
    FOOTY: "footy",
    Winamax: "winamax",
});

class PanelSelector {
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


class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    // Helper method for making requests
    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Add data to the request if it's a POST, PUT, or PATCH request
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            // Check if the response is successful (status in the range 200-299)
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            // Parse JSON if possible
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("API Request error:", error.message);
            throw error;
        }
    }

    // Method for GET requests
    async get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    // Method for POST requests
    async post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    }

    // Method for PUT requests
    async put(endpoint, data) {
        return this.request(endpoint, 'PUT', data);
    }

    // Method for DELETE requests
    async delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class FavouriteGame {
    constructor({dateString, homeTeam, awayTeam, sport, competition, source}) {
        // Enforce required properties
        if (!dateString || !homeTeam || !awayTeam || !sport || !competition || !source) {
            throw new Error("All properties are required to create a FavouriteGame instance.");
        }

        // Initialize properties
        this.dateString = dateString;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.sport = sport;
        this.competition = competition;
        this.source = source;
    }
}


class AddTicketCommand {
    constructor({
                    betType = "",
                    ticketStatus = "",
                    games = [],
                    dateString = "",
                    betId = "",
                    stake = "",
                    totalOdd = "",
                    comment = "",
                    outerHtml = ""
                } = {}) {
        this.betType = betType;              // Equivalent to string in C#
        this.ticketStatus = ticketStatus;    // Equivalent to string in C#
        this.games = games;                  // Array of AddGameModel instances
        this.dateString = dateString;        // Date in string format
        this.betId = betId;
        this.stake = stake;
        this.totalOdd = totalOdd;
        this.comment = comment;
        this.outerHtml = outerHtml;
    }
}


class AddGameModel {
    constructor({
                    betStatusColor = "",
                    competition = "",
                    gameTitle = "",
                    sport = "",
                    isBoosted = false,
                    selectedTips = [],
                    isLive = false,
                    isBetBuilder = false,
                    odd = ""
                } = {}) {
        this.betStatusColor = betStatusColor;  // Color for bet status as string
        this.competition = competition;        // String value for competition
        this.gameTitle = gameTitle;            // Title of the game
        this.sport = sport;                    // Sport as string
        this.isBoosted = isBoosted;            // Boolean value for boost status
        this.selectedTips = selectedTips;      // Array of strings
        this.isLive = isLive;                  // Boolean indicating live status
        this.isBetBuilder = isBetBuilder;      // Boolean indicating bet builder
        this.odd = odd;                        // String value for odds
    }
}
