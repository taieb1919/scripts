﻿async function initMenuTopRight() {
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

function SetStakeForForSingleTicket(newStake, element) {
    const info = GetBetInfo(element);
    const newStakeFloat = parseFloat(newStake.replace(',', '.'));
    const allGamesElement = SelectAllGamesElementsByTicket(element);
    let SpanOddTotal = 1.00;
    if (!info.spanOddTotal && info.spanMiseFreeBets) {

        const singleTip = allGamesElement[0];
        const tipData = ExtractSingleTipData(singleTip);
        SpanOddTotal = parseFloat(tipData.TipOdds.textContent.replace(',', '.'));

    } else {

        allGamesElement.forEach(e => {
            const tipData = ExtractSingleTipData(e);
            SpanOddTotal *= parseFloat(tipData.TipOdds.textContent.replace(',', '.'));
        });

    }
    const amountFormatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    });

    let miseTotaleOriginal;
    if (info.spanMise) {
        miseTotaleOriginal = parseFloat(info.spanMise.textContent.replace(',', '.'));
        info.spanMise.textContent = amountFormatter.format(newStake);

        if (info.StatusBet && info.StatusBet.trim() === "Gagné") {
            info.spanGains.textContent = amountFormatter.format(newStakeFloat * SpanOddTotal);
        }

        if (info.spanComboBooster) {
            const oldComboBooster = parseFloat(info.spanComboBooster.textContent.replace(',', '.'));
            const comboMultiplier = newStakeFloat / miseTotaleOriginal;

            info.spanComboBooster.textContent = amountFormatter.format(oldComboBooster * comboMultiplier)
        }
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
        const newStake = GetSelectedRadioButtonValue("stake");

        if (newStake) {
            

            const allBetsNodes = SelectAllBets();

            allBetsNodes.forEach(e => {
                SetStakeForForSingleTicket(newStake, e)
            })

            closeMainModal();

        } else {
            console.log("Please select an option for both questions.");
        }


    };
    openMainModal();
}

function GetSelectedRadioButtonValue(groupName) {
    const selectedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
    let selectedValue;
    if (selectedRadio) {
        selectedValue = selectedRadio.nextElementSibling.textContent.trim();
    }

    return selectedValue;
}

function ExtractSingleTipData(singleTip) {
    const TipAndOddNode = singleTip.firstElementChild;
    const MatchNode = singleTip.lastElementChild;
    let isBetBuilderGame = false;
    let selectedTips;
    let TipOdds;
    let betStatusColor;
    const TipAndOddNodePrincipal = Array.from(TipAndOddNode.querySelectorAll("div")).find(div => div.children.length > 1);
    if (TipAndOddNodePrincipal.lastElementChild.classList.contains("CollapseListItem-collapse")) {
        isBetBuilderGame = true;
    }
    if (isBetBuilderGame) {
        TipOdds = TipAndOddNodePrincipal.firstElementChild?.lastElementChild;
        let betBuilderTips = Array.from(TipAndOddNodePrincipal.lastElementChild.querySelectorAll("div")).find(div => div.children.length > 1);

        if (!betBuilderTips)
            betBuilderTips = Array.from(TipAndOddNodePrincipal.lastElementChild.querySelectorAll("span")).find(div => div.children.length > 1);


        Array.from(betBuilderTips.firstElementChild.children).forEach((e) => {
            const rootSpan = e.querySelector('span');
            const joinedText = Array.from(rootSpan.children)
                .map(child => child.textContent)
                .join(' - ')

            //selectedTips.push(joinedText);
        })
        selectedTips = betBuilderTips.children;
    } else {

        let selectedTipsJoined;
        selectedTipsJoined = Array.from(TipAndOddNodePrincipal.firstElementChild.lastElementChild.children)
            .map(child => child.textContent)
            .join(' - ');
        selectedTips = TipAndOddNodePrincipal.firstElementChild.lastElementChild.children;//.push(selectedTipsJoined);
        TipOdds = TipAndOddNodePrincipal.lastElementChild;
    }
    betStatusColor = TipAndOddNodePrincipal.firstElementChild.querySelector('svg').querySelector('circle').getAttribute('fill');
    if (MatchNode.querySelector("span")) {
        const span = MatchNode.querySelector('span');

// Remove the <span> element from the <div>
        if (span) {
            span.innerText = ' ';
        }
    }

    let matchTitle = MatchNode.textContent;
    let sportValue = SportsDictionary.findSportsByClassList(MatchNode.firstElementChild.firstElementChild.classList);

    return {isBetBuilderGame, sportValue, matchTitle, TipOdds, selectedTips, betStatusColor};
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
    
    const spanMise = allSpansArray.find(el => el.textContent.trim() === "Mise")?.parentElement.lastElementChild;
    const spanMiseFreeBets = allSpansArray.find(el => el.textContent.toLowerCase().trim() === "Mise Freebets".toLowerCase().trim())?.parentElement.lastElementChild;
    const spanComboBooster = allSpansArray.find(el => el.textContent.trim() === "Gains Combo booster".trim())?.parentElement.lastElementChild;
    const spanGains = allSpansArray.find(el => el.textContent.trim() === "Gains".trim())?.parentElement.lastElementChild;
    const spanOddTotal = allSpansArray.find(el => el.textContent.replace(/\s+/g, ' ').trim().toLowerCase() === "Cote totale".trim().toLowerCase())?.parentElement.querySelector("div");

    const headerNode = element.children[1].firstElementChild;

    const StatusBet = headerNode.children[0];
    const TypeBet = headerNode.children[1];
    const betIdDate = GetBetIdentity(element);
    const betDateDiv = betIdDate.betDateDiv;
    const betIdDiv = betIdDate.betIdDiv;
    return {
        StatusBet,
        TypeBet,
        spanMise,
        spanMiseFreeBets,
        spanGains,
        spanOddTotal,
        spanComboBooster,
        betDateDiv,
        betIdDiv
    };
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


// Function to append the contextual menu to a specific element
function appendContextualMenu(element) {
    const contextHtml = `
    <button class="Btn-TaiebAnalytix-contextual-menu Btn-contextual-menu-blue" taieb-data-id="telegram-Send">
            <div class="sign-TaiebAnalytix-contextual-menu">
                <span><i class="fa-brands fa-telegram fa-2xs"></i></span>
            </div>
            <div class="text-TaiebAnalytix-contextual-menu">Send Telegram</div>
        </button>

        <button class="Btn-TaiebAnalytix-contextual-menu Btn-contextual-menu-black" taieb-data-id="Save-in-data-base">
            <div class="sign-TaiebAnalytix-contextual-menu">
                <span><i class="fa-solid fa-up-right-from-square fa-2xs"></i></span>
            </div>
            <div class="text-TaiebAnalytix-contextual-menu"> Save in data Base</div>
        </button>

        <button class="Btn-TaiebAnalytix-contextual-menu Btn-contextual-menu-green" taieb-data-id="Update-Ticket-Stake">
            <div class="sign-TaiebAnalytix-contextual-menu">
                <span><i class="fa-regular fa-money-bill-1 fa-2xs"></i></span>
            </div>
            <div class="text-TaiebAnalytix-contextual-menu"> Update Ticket Stake</div>
        </button>

        <button class="Btn-TaiebAnalytix-contextual-menu Btn-contextual-menu-orange">
            <div class="sign-TaiebAnalytix-contextual-menu">
                <span><i class="fa-regular fa-heart fa-2xs"></i></span>
            </div>
            <div class="text-TaiebAnalytix-contextual-menu">Logout</div>
        </button>
    `;
    const contextualMenu = document.createElement('div');
    contextualMenu.innerHTML = contextHtml;
    contextualMenu.className = 'container-TaiebAnalytix-contextual-menu'; // Add any classes or styles here

    const telegramBtn = contextualMenu.querySelector('button[taieb-data-id="telegram-Send"]');
    const saveDataBase = contextualMenu.querySelector('button[taieb-data-id="Save-in-data-base"]');
    const updateTicketStake = contextualMenu.querySelector('button[taieb-data-id="Update-Ticket-Stake"]');

    telegramBtn.onclick = () => SendTelegram(element);
    saveDataBase.onclick = () => SaveTicketInDataBase(element);
    updateTicketStake.onclick = () => UpdateTicketStake(element);

    element.appendChild(contextualMenu); // Append the menu to the matched element
}

function SendTelegram(element) {
    SendSuccessMessage("SendTelegram")
}

function UpdateTicketStake(element) {
    SendErrorMessage("UpdateTicketStake")
}

function SaveTicketInDataBase(element) {
    SendWarningMessage("SaveTicketInDataBase")
}

// Set up the MutationObserver to monitor for new elements with the specified selector
const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                // Check if the new node is an element and matches the selector
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('[data-testid^="history-item-"]')) {
                    appendContextualMenu(node); // Append the contextual menu to the matching element
                }
            });
        }
    });
});

// Configuration for the observer (what changes to observe)
const config = {
    childList: true,  // Look for addition/removal of child elements
    subtree: true     // Look within the entire subtree
};

// Start observing the document's body or a specific container
observer.observe(document.body, config);