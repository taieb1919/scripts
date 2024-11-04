function AppendNotificationDiv() {
    const notificationBox = document.createElement("div");

    // Set the classes for styling
    notificationBox.className = "tibou-analytix-notification-box tibou-analytix-toast-container flex flex-col items-center justify-center fixed w-full z-50 p-3 ";

    // Position the notification box at the bottom-right of the page
    notificationBox.style.position = "fixed";
    notificationBox.style.bottom = "20px";
    notificationBox.style.right = "20px";
    notificationBox.style.zIndex = "99999999999999";

    // Append the notification box to the body
    document.body.appendChild(notificationBox);

}

function sendNotification(type, text) {

    let notificationBox = document.querySelector(".tibou-analytix-notification-box");
    const toastHtml = `
       <div class="toast-TaiebAnalytix-Toast-Notification active">

    <div class="toast-content-TaiebAnalytix-Toast-Notification">
        <i class="fas fa-solid check-TaiebAnalytix-Toast-Notification"></i>

        <div class="message-TaiebAnalytix-Toast-Notification">
            <span class="text-TaiebAnalytix-Toast-Notification text-1-TaiebAnalytix-Toast-Notification">Success</span>
            <span class="text-TaiebAnalytix-Toast-Notification text-2-TaiebAnalytix-Toast-Notification">Your changes has been saved</span>
        </div>
    </div>
    <i class="fa-solid fa-xmark close-TaiebAnalytix-Toast-Notification"></i>

    <div class="progress-TaiebAnalytix-Toast-Notification active"></div>
</div>
    `;

    const alerts = {
        info: {
            Icon: "fa-info",
            color: "info-TaiebAnalytix-Toast-Notification",
            Title: "Information"
        },
        error: {
            Icon: "fa-bug",
            color: "error-TaiebAnalytix-Toast-Notification",
            Title: "Error"
        },
        warning: {
            Icon: "fa-triangle-exclamation",
            color: "warning-TaiebAnalytix-Toast-Notification",
            Title: "Warning"
        },
        success: {
            Icon: "fa-check",
            color: "success-TaiebAnalytix-Toast-Notification",
            Title: "Success"
        }
    };
    let component = document.createElement("div");
    component.innerHTML = toastHtml;


    notificationBox.appendChild(component);
    const toast = component.querySelector(".toast-TaiebAnalytix-Toast-Notification");
    (progress = component.querySelector(".progress-TaiebAnalytix-Toast-Notification")),
        (titleSpan = component.querySelector(".text-1-TaiebAnalytix-Toast-Notification")),
        (textSpan = component.querySelector(".text-2-TaiebAnalytix-Toast-Notification")),
        (iconSelector = component.querySelector(".check-TaiebAnalytix-Toast-Notification")),
        (closeIcon = component.querySelector(".close-TaiebAnalytix-Toast-Notification"));

    textSpan.textContent = text;
    titleSpan.textContent = alerts[type].Title;

    let timer1, timer2;

    iconSelector.classList.add(alerts[type].Icon);
    iconSelector.classList.add(alerts[type].color);

    toast.classList.add("active");
    progress.classList.add("active");
    progress.classList.add(alerts[type].color);

    timer1 = setTimeout(() => {
        toast.classList.remove("active");
    }, 5000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
        progress.classList.remove("active");
    }, 5300);


    closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");

        setTimeout(() => {
            progress.classList.remove("active");
        }, 300);
        notificationBox.removeChild(component);
        clearTimeout(timer1);
        clearTimeout(timer2);
    });

    setTimeout(() => {
        if (notificationBox.contains(component)) {
            // Only remove the child if it exists in the parent
            notificationBox.removeChild(component);
        }
    }, 5700);

}


function SendInfoMessage(text) {
    sendNotification("info", text);
}

function SendErrorMessage(text) {
    sendNotification("error", text);
}

function SendWarningMessage(text) {
    sendNotification("warning", text);
}

function SendSuccessMessage(text) {
    sendNotification("success", text);
}
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
const repoGit = "https://github.com/taieb1919/scripts/raw/refs/heads/main/js/";


async function AddMenusAndLodAllFile(menuHtml) {
    // Fetch the CSS content
    let contentCssFile = "";
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/taieb1919/scripts/refs/heads/main/styles/analytixStyle.css"
        );
        if (response.ok) {
            contentCssFile = await response.text();
        } else {
            console.error("Failed to load CSS file analytixStyle.");
        }
    } catch (error) {
        console.error("Error fetching CSS analytixStyle :", error);
    }

    // Apply the fetched CSS content
    const style = document.createElement("style");
    style.textContent = contentCssFile;
    document.head.appendChild(style);


    // Insert the menu into the page
    const menuContainer = document.createElement("div");
    menuContainer.innerHTML = menuHtml;
    menuContainer.style.position = "fixed";
    menuContainer.style.top = "40px";
    menuContainer.style.right = "40px";
    menuContainer.style.zIndex = "9999999999999"; // Ensure it stays on top of other elements
    document.body.appendChild(menuContainer);
}

// region Importing cs and js files 
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.async = false;
        script.onload = () => {
            console.log(`Loaded: ${url}`);
            resolve();
        };
        script.onerror = () => reject(`Failed to load: ${url}`);
        document.head.appendChild(script);
    });
}

// Function to dynamically load a CSS file
function loadCSS(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.onload = () => resolve(console.log(`CSS Loaded: ${url}`));
        link.onerror = () => reject(`Failed to load CSS: ${url}`);
        document.head.appendChild(link);
    });
}

function ImportFonts() {
    // Define the URLs for the fonts
    const fontUrls = [
        "https://fonts.googleapis.com/css?family=Oswald:400,700",
        "https://fonts.googleapis.com/css?family=Nunito:400,700",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
    ];
    // Loop through each URL and create a <link> element
    fontUrls.forEach((url) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
    });


// Load jQuery 1.12.4, then Bootstrap JavaScript
    loadScript("https://code.jquery.com/jquery-1.12.4.min.js")
        .then(() => {
            // Avoid conflicts with existing jQuery versions
            const jq = jQuery.noConflict(true);
            window.jQuery = jq;
            window.$ = jq;

            // Now load Bootstrap JavaScript after jQuery
            return loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js");
        })
        .then(() => {
            console.log("Bootstrap and jQuery loaded.");

            // Verify if Bootstrap's modal function is available
            console.log("jQuery version:", jQuery.fn.jquery);
            console.log("Bootstrap modal function:", $.fn.modal);


        })
        .catch((error) => {
            console.error("Error loading scripts:", error);
        });

// Alternative URLs for Bootstrap 3.3.7 CSS
    const bootstrapCDN = "https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    const jsdelivrCDN = "https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css";
    const analytixStylecss = "https://raw.githubusercontent.com/taieb1919/scripts/refs/heads/main/styles/analytixStyle.css";
    const modalCss = "https://raw.githubusercontent.com/taieb1919/scripts/refs/heads/main/styles/Modal.css";

// Test loading from StackPath
    loadCSS(bootstrapCDN)
        .catch(() => loadCSS(jsdelivrCDN));
    //loadCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css");

    loadCSS(analytixStylecss)
        .then(async () => {
            // Fetch the CSS content
            let contentCssFile = "";
            try {
                const response = await fetch(
                    analytixStylecss
                );
                if (response.ok) {
                    contentCssFile = await response.text();
                } else {
                    console.error("Failed to load CSS file analytixStyle.");
                }
            } catch (error) {
                console.error("Error fetching CSS analytixStyle :", error);
            }

            // Apply the fetched CSS content
            const style = document.createElement("style");
            style.textContent = contentCssFile;
            document.head.appendChild(style);
        });
    loadCSS(modalCss)
        .then(async () => {
            // Fetch the CSS content
            let contentCssFile = "";
            try {
                const response = await fetch(
                    modalCss
                );
                if (response.ok) {
                    contentCssFile = await response.text();
                } else {
                    console.error("Failed to load CSS file analytixStyle.");
                }
            } catch (error) {
                console.error("Error fetching CSS analytixStyle :", error);
            }

            // Apply the fetched CSS content
            const style = document.createElement("style");
            style.textContent = contentCssFile;
            document.head.appendChild(style);
        });
}


// endregion Importing cs and js files 
function loadAllNeededScripts() {


    const defaultsScripts = [
        "commons.js",
        "modal.js",
        "alerts.js",

    ];


    defaultsScripts.forEach((script) => {
        loadScript(repoGit + script)
            .then(() => {

                console.log(`${script} loaded.`);
            }).catch((error) => {
                console.error(`Error loading script ${script}:`, error);
            }
        );

    });
}





// region  Modal
// region  yes no Modal
// Function to display the modal
function openMainModal() {

    const mainModal = document.getElementById("main-TaiebAnalytix-Modal");
    mainModal.classList.add("active")
}

// Function to close the modal
function closeMainModal() {

    const mainModal = document.getElementById("main-TaiebAnalytix-Modal");
    mainModal.classList.remove("active")

}

function SetModalFormHeaderTitle(text) {

    document.getElementById("title-TaiebAnalytix-Modal").textContent = text;
}

function GetModalForm() {

    return document.getElementById("TaiebAnalytix-Modal-form");
}

function GetModalFormContent() {

    return document.getElementById("content-TaiebAnalytix-Modal-form");
}

function ClearModalFormContent() {

    GetModalFormContent().innerHTML = "";
}

// endregion  yes no Modal
function AppendModalBloc() {
    const modalHTML = `
 
    <div class="popup-TaiebAnalytix-Modal">
        <h2 id="title-TaiebAnalytix-Modal">Here i am</h2>
        <a class="close-TaiebAnalytix-Modal" id="btn-close-TaiebAnalytix-Modal">&times;</a>
        <form id="TaiebAnalytix-Modal-form" class="TaiebAnalytix-Modal-form">
            <div id="content-TaiebAnalytix-Modal-form" class="content-TaiebAnalytix-Modal">

            </div>
            <div class="btns-TaiebAnalytix-Modal">
                <button class="taieb-btn red-btn" id="TaiebAnalytix-Modal-form-cancel-btn" type="button">Cancel</button>
                <button class="taieb-btn green-btn" type="submit">Confirm</button>
            </div>
        </form>
    </div>


`;

    const modalContainer = document.createElement("div");
    modalContainer.id = "main-TaiebAnalytix-Modal";
    modalContainer.className = "overlay-TaiebAnalytix-Modal ";
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    const cancelBtn = document.getElementById("TaiebAnalytix-Modal-form-cancel-btn");

    const closeBtn = document.getElementById("btn-close-TaiebAnalytix-Modal");


    closeBtn.onclick = () => closeMainModal();
    cancelBtn.onclick = () => closeMainModal();
}

function AppendCheckBox() {
    const checkBoxHtml = `
    <div class="checkbox-list">
    <label class="material-checkbox">
        <input type="checkbox">
        <span class="checkmark"></span>
        One
    </label>

    <label class="material-checkbox">
        <input type="checkbox" disabled>
        <span class="checkmark"></span>
        Two
    </label>
    <label class="material-checkbox">
        <input type="checkbox">
        <span class="checkmark"></span>
        Three
    </label>

</div>
    `;
}

function GenerateRadioButtonGroup(groupName, defaultSelected, ...choices) {


    let div = document.createElement("div");
    div.classList.add("radio-input-TaiebAnalytix-radio_button");

    choices.forEach((choice) => {
        var checked = choice === defaultSelected ? 'checked' : '';
        const choiceHtml = `
        <label class="abel-TaiebAnalytix-radio_button">
        <input type="radio" name="${groupName}" class="input-radio-TaiebAnalytix-radio_button" ${checked}>
        <span class="span-TaiebAnalytix-radio_button">${choice}</span>
    </label>
        `;
        div.insertAdjacentHTML('beforeend', choiceHtml);


    })


    return div;
}

// endregion  Modal
async function initMenuTopRight() {
    //loadAllNeededScripts();

    ImportFonts();

    const menuHtml = BuildMenu();
    await AddMenusAndLodAllFile(menuHtml);
    AppendNotificationDiv();
    AppendModalBloc();
    AddButtonEventListeners();
}


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


function SetStakeForAllPlayedTicket() {
    ClearModalFormContent();

    const form = GetModalForm();
    const modalContentDiv = GetModalFormContent();
    const radioBtns = GenerateRadioButtonGroup("stake", "100", "25", "50", "100");
    modalContentDiv.appendChild(radioBtns);
    SetModalFormHeaderTitle("Set stake for all Closed tickets");
    form.onsubmit = (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get the selected value of "favoriteColor"
        const selectedStake = document.querySelector('input[name="stake"]:checked');

        if (selectedStake) {

            
            const allBetsNodes = SelectAllBets();
            const singleGamenod = allBetsNodes[0];
            const info = GetBetInfo(singleGamenod);
            const idDate = GetBetIdentity(singleGamenod)
            const txt = `Ref: ${idDate.betIdDiv.textContent}       <br>Date: ${idDate.betDateDiv.textContent}      <br> Mise :   ${info.spanMise?.textContent}    <br>Gain :   ${info.spanGains?.textContent}    <br>Odds :   ${info.spanOddTotal?.innerText}     <br>Combo Booster :   ${info.spanComboBooster?.textContent}    `;
            SendInfoMessage(`selected stake : ${txt}`);

            const allGamesElement = SelectAllGamesElementsByTicket(singleGamenod);

            const singleTip = allGamesElement[0];
            const tipData = ExtractSingleTipData(singleTip);
            const txt2=`Match : ${tipData.matchTitle}<br>Odds :   ${tipData.TipOdds}    tips: ${tipData.selectedTips.map(child => child.textContent)
                .join('<br>')}`;
            
            SendErrorMessage(txt2);
            closeMainModal();

        } else {
            console.log("Please select an option for both questions.");
        }


    };
    openMainModal();
}

function ExtractSingleTipData(singleTip) {
    const TipAndOddNode = singleTip.firstElementChild;
    const MatchNode = singleTip.lastElementChild;
    let isBetBuilderGame = false;
    let selectedTips = [];
    let TipOdds = "";
    const TipAndOddNodePrincipal = Array.from(TipAndOddNode.querySelectorAll("div")).find(div => div.children.length > 1).firstElementChild;
    if (TipAndOddNodePrincipal.lastElementChild.hasClass("CollapseListItem-collapse")) {
        isBetBuilderGame = true;
    }
    if (isBetBuilderGame) {
        TipOdds = TipAndOddNodePrincipal.firstElementChild?.lastElementChild?.textContent;
        const betBuilderTips = Array.from(TipAndOddNodePrincipal.lastElementChild.querySelectorAll("div")).find(div => div.children.length > 1).firstElementChild;
        Array.from(betBuilderTips.children).forEach((e) => {
            const rootSpan = e.querySelector('span');
            const joinedText = Array.from(rootSpan.children)
                .map(child => child.textContent)
                .join(' - ')

            selectedTips.push(joinedText);
        })

    } else {
        selectedTips.push(TipAndOddNodePrincipal.firstElementChild.textContent);
        TipOdds = TipAndOddNodePrincipal.lastElementChild.textContent;
    }

    if (MatchNode.querySelector("span")) {
        const span = MatchNode.querySelector('span');

// Remove the <span> element from the <div>
        if (span) {
            span.innerText = ' ';
        }
    }

    let matchTitle = MatchNode.textContent;

    return {matchTitle, TipOdds, selectedTips};
}

function AddButtonEventListeners() {
    const myButton1 = document.getElementById("card-TaiebAnalytix-Menu-btn1");
    myButton1.onclick = () => {
        SendSuccessMessage("Hello");

    };

    const myButton2 = document.getElementById("card-TaiebAnalytix-Menu-btn2");
    myButton2.onclick = async () => {

        await ExtractWinAMaxFavouriteGames()
    };
    const myButton3 = document.getElementById("card-TaiebAnalytix-Menu-btn3");
    myButton3.onclick = () => {
        SendErrorMessage("Hello ssqd sqds qsd sqdsq dqlmkkqsfd qsdklmqes  sqdqklqdlqk qd  qsksqd kmùdsqsqd qdqkqs" +
            "qdùmùdlkmùdmls ùkqsdmùlksdq mùlkqsdl sqùmkmùdkqds ");

    };
    const myButton4 = document.getElementById("card-TaiebAnalytix-Menu-btn4");
    myButton4.onclick = () => {
        SetStakeForAllPlayedTicket();

    };

    const myButton5 = document.getElementById("card-TaiebAnalytix-Menu-btn5");
    myButton5.addEventListener("click", function () {

        function ExtractingBetsHistoryFullProcess() {
            openMainModal();
        }

        ExtractingBetsHistoryFullProcess()

    });
}

function GetBetIdentity(element) {

    const betIdDateDiv = element.lastElementChild.lastElementChild;

    const betIdDiv = betIdDateDiv.firstElementChild;
    const betDateDiv = betIdDateDiv.lastElementChild;

    return {betIdDiv, betDateDiv};
}

function GetBetInfo(element) {
    const allSpansArray = Array.from(element.querySelectorAll('span'));
    allSpansArray.forEach(x => {
        console.log(x.textContent);
    })
    const spanMise = allSpansArray.find(el => el.textContent.trim() === "Mise")?.parentElement.lastElementChild;
    const spanComboBooster = allSpansArray.find(el => el.textContent.trim() === "Gains Combo booster".trim())?.parentElement.lastElementChild;
    const spanGains = allSpansArray.find(el => el.textContent.trim() === "Gains".trim())?.parentElement.lastElementChild;
    const spanOddTotal = allSpansArray.find(el => el.textContent.replace(/\s+/g, ' ').trim().toLowerCase() === "Cote totale".trim().toLowerCase())?.parentElement.querySelector("div");

    return {spanMise, spanGains, spanOddTotal, spanComboBooster};
}

function SelectAllGamesElementsByTicket(element) {
    return Array.from(element.querySelectorAll('a'));
}

function SelectAllBets() {
    ExpandAllBets();
    const singleBetSelector = '[data-testid^="history-item-"]';
    return document.querySelectorAll(singleBetSelector);

}


function ExpandAllBets() {
    const historyStatusSelector = '[data-testid="history-status-filter"]';
    const statusHistoryDiv = document.querySelector(historyStatusSelector)
    statusHistoryDiv.firstElementChild.lastElementChild.click();
}

async function ExtractWinAMaxFavouriteGames() {
    if (!window.location.pathname.endsWith("favorites")) {
        console.log("The current URL ends with 'favorites'");
        SendWarningMessage("Please Go To Favourite page");
        return;
    }
//data-testid="middleColumn"


    const middleColumnSelector = 'div[data-testid="middleColumn"]';
    const singleMatchSelector = '[data-testid^="match-card-"]';

    const allFavourites = [];
// Check if we have any matches
    let finished = false;
    let LastElementTreated = null
    do {
        let middleColumn = document.querySelector(middleColumnSelector);
        // Find all elements that match the selector in the document
        let allMatches = middleColumn.querySelectorAll(singleMatchSelector);

        allMatches.forEach(e => {
                let singleFav = ExtractFav(e);
                if (singleFav)
                    allFavourites.push(singleFav);
            }
        );


// Check if there are any matches and get the last element
        const lastElement = allMatches.length > 0 ? allMatches[allMatches.length - 1] : null;
        if (lastElement) {

            lastElement.scrollIntoView({
                behavior: 'smooth', // Smooth scroll animation
                block: 'center',    // Aligns the element to the center of the viewport
                inline: 'nearest'   // Horizontal alignment, if applicable
            });
        } else {
            console.log("No elements found matching the selector.");
        }
        await sleep(2000);
        allMatches = document.querySelectorAll(singleMatchSelector);
        LastElementTreated = allMatches.length > 0 ? allMatches[allMatches.length - 1] : null;
        finished = LastElementTreated === lastElement;


    } while (!finished);


    function ExtractFav(element) {

        try {


            const timeSelector = '.card-header-timer';
            const matchTitleSelector = '.full-match-title';
            const sportSelector = '.boostedIcon';

            let matchTime = element.querySelector(timeSelector).textContent;
            let sportsClass = element.querySelector(sportSelector).classList;
            let sportName = SportsDictionary.findSportsByClassList(sportsClass)
            let GameInfoPanel = element.querySelector(matchTitleSelector);

            const teamsSpans = GameInfoPanel?.firstElementChild.querySelectorAll('span');
            const homeTeam = teamsSpans[0].textContent;
            const awayTeam = teamsSpans[teamsSpans.length - 1].textContent;

            const competition = GameInfoPanel?.lastElementChild.textContent;


            const game = new FavouriteGame({
                dateString: matchTime,
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                sport: sportName,
                competition: competition,
                source: "Winamax"
            });
            console.log(game);

            return game;
        } catch (error) {
            // Handle the error
            console.error("An error occurred:", error.message);
            return null;
        } finally {
            console.log("This block always runs, regardless of errors.");
        }

    }


    let api = new ApiClient('https://localhost:7195/');

    api.post("favourites", {
        FavouriteGames: allFavourites
    })
        .then(response => console.log(response.data))
        .catch(error => {
            console.error("Error posting favorites:", error.message);
            let errorMsg = "Error posting favorites:" + error.message;
            // Optional: Log more details about the error if available
            if (error.response) {
                errorMsg += "\n Status:" + error.response.status;
                errorMsg += "\n Error data:" + error.response.data;
                console.error();
                console.error("Error data:", error.response.data);

            }
            SendErrorMessage(errorMsg);
        });


}


function BuildMenu() {
    return `
        <div class="card-TaiebAnalytix-Menu-Card">
    <ul class="list-TaiebAnalytix-Menu-Card">
        <li class="element-TaiebAnalytix-Menu-Card"   id="card-TaiebAnalytix-Menu-btn1">
                <span>
                    <i class="fa-solid fa-up-right-from-square"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Extract Played ticket</p>
        </li>
        <li class="element-TaiebAnalytix-Menu-Card" id="card-TaiebAnalytix-Menu-btn2">
             <span>
                    <i class="fa-regular fa-heart"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Favourite Game Extract</p>
        </li>
        <li class="element-TaiebAnalytix-Menu-Card" id="card-TaiebAnalytix-Menu-btn3">
                <span>
                    <i class="fa-solid fa-receipt"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Extract Current Coupon</p>
        </li>
        
        <li class="element-TaiebAnalytix-Menu-Card " id="card-TaiebAnalytix-Menu-btn4">
                <span>
                    <i class="fa-regular fa-money-bill-1"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Set Stake for All closed tickets</p>
        </li>
    </ul>
    <div class="separator-TaiebAnalytix-Menu-Card"></div>
    <ul class="list-TaiebAnalytix-Menu-Card">
        
        <li class="element-TaiebAnalytix-Menu-Card delete-TaiebAnalytix-Menu-Card" id="card-TaiebAnalytix-Menu-btn5">
                <span>
                    <i class="fa-regular fa-circle-stop"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Stop Process</p>
        </li>
    </ul>
    <div class="separator-TaiebAnalytix-Menu-Card"></div>
</div>
    `;
}