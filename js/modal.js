// region  Modal
// region  yes no Modal
// Function to display the modal
function openYesNoModal() {

    $(".tibou-analytix-modal-internal .modalcontainer,.modal").fadeOut("slow");
}

// Function to close the modal
function closeYesNoModal() {

    $(".tibou-analytix-modal-internal .modalcontainer,.modal").fadeIn("slow");

}
// endregion  yes no Modal
function AppendYesNoModal() {
    const modalHTML = `
<div class="tibou-analytix-modal-internal" id="tibou-analytix-modal-internal">
<div class="flex">
    <div class="modalcontainer">
        <div class="flex">
            <div class="modal">
                <div class="close"><span>&#43;</span></div>
                <div class="content">
                    <h2>Modal title</h2>
                    <p>Let's go up in here, and start having some fun The very fact that you're aware of suffering is enough reason to be overjoyed that you're alive and can experience it. It's a super day, so why not make a beautiful sky?</p>
                </div>
                
                <div class="buttons">
                    <a href="#0">Cancel</a>
                    <a href="#0">Accept</a>
                </div>
            </div>
        </div>
    </div>
    <a href="#0" class="modalbttn">Open Modal</a>
</div>`;

    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

}


function ShowYesNoModal(titleModal, descriptionModal, yesText, noText, callback) {


    const myModalYesNo = document.getElementById("tibou-analytix-modal-internal");
    const myModalTitle = myModalYesNo.querySelector(".tibou-analytix-modal-internal .content h2");
    const myModalDescription = myModalYesNo.querySelector(".tibou-analytix-modal-internal .content p");

    myModalTitle.textContent = titleModal;
    myModalDescription.textContent = descriptionModal;

    const noButton = document.querySelector('.tibou-analytix-modal-internal .buttons a:first-of-type');
    const yesButton = document.querySelector('.tibou-analytix-modal-internal .buttons a:last-of-type');

    yesButton.textContent = yesText;
    noButton.textContent = noText;


    // Clear all click event listeners
    yesButton.onclick = null;

// Add new event listener
    yesButton.onclick = function () {
        yesButton.disabled = true;
        noButton.disabled = true;
        callback(yesButton.textContent);
        closeYesNoModal();
        yesButton.disabled = false;
        noButton.disabled = false;
    };
    // Clear all click event listeners
    noButton.onclick = null;

// Add new event listener
    noButton.onclick = function () {
        yesButton.disabled = true;
        noButton.disabled = true;
        callback(noButton.textContent);
        closeYesNoModal();

        yesButton.disabled = false;
        noButton.disabled = false;
    };


    openYesNoModal();
}

// endregion  Modal