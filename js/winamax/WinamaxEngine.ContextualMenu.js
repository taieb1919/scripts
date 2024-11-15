
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