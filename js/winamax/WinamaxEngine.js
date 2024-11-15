async function initMenuTopRight() {
    //loadAllNeededScripts();

    ImportFonts();

    const menuHtml = BuildMenu();
    await AddMenusAndLodAllFile(menuHtml);
    AppendNotificationDiv();
    AppendModalBloc();
    AddButtonEventListeners();
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

