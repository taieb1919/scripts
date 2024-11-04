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
            const txt = `Ref: ${idDate.betIdDiv.textContent}       \nDate: ${idDate.betDateDiv.textContent}      \n Mise :   ${info.spanMise?.textContent}    \nGain :   ${info.spanGains?.textContent}    \nOdds :   ${info.spanOddTotal?.innerText}     \nCombo Booster :   ${info.spanComboBooster?.textContent}    `;
            SendInfoMessage(`selected stake : ${txt}`);

            const allGamesElement = SelectAllGamesElementsByTicket(singleGamenod);

            const singleTip = allGamesElement[0];
            const tipData = ExtractSingleTipData(singleTip);
            const txt2=`Match : ${tipData.matchTitle}\nOdds :   ${tipData.TipOdds}    tips: ${tipData.selectedTips.map(child => child.textContent)
                .join('\n')}`;
            
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
    let TipOdds;
    const TipAndOddNodePrincipal = Array.from(TipAndOddNode.querySelectorAll("div")).find(div => div.children.length > 1);
    if (TipAndOddNodePrincipal.lastElementChild.classList.contains("CollapseListItem-collapse")) {
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
        let selectedTipsJoined;
        selectedTipsJoined = Array.from(TipAndOddNodePrincipal.firstElementChild.lastElementChild.children)
            .map(child => child.textContent)
            .join(' - ');
        selectedTips.push(selectedTipsJoined);
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