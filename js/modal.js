function AppendYesNoModal() {
    const modalHTML = `
<div class="tibou-analytix-modal-box">
                <!-- Modal -->
                <div class="modal fade" id="myModalYesNo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div class="tibou-analytix-modal-dialog" role="document">
                        <div class="tibou-analytix-modal-content clearfix">
                            <button type="button" class="tibou-analytix-modal-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <div class="tibou-analytix-modal-body">
                                <h3 class="tibou-analytix-modal-title">massa vitae mi mollis.</h3>
                                <p class="tibou-analytix-modal-description">
                                    Nam venenatis nisl sed lacus varius, gravida fringilla sem maximus. Sed diam metus, malesuada sed sollicitudin eu, fermentum quis sapien.
                                </p>
                                <button id="tibou-analytix-YesNoModal-NoResponse" class="tibou-analytix-modal-subscribe tibou-analytix-modal-cancel">Not Yet</button>
                                <button id="tibou-analytix-YesNoModal-YesResponse" class="tibou-analytix-modal-subscribe">Get premium</button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>`;

    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

}

// Function to display the modal
function openYesNoModal() {

    $("#myModalYesNo").modal("show");
}

// Function to close the modal
function closeYesNoModal() {

    $("#myModalYesNo").modal("hide");
    
}


function ShowYesNoModal(titleModal, descriptionModal, yesText, noText, callback) {


    const myModalYesNo = document.getElementById("myModalYesNo");
    const myModalTitle = myModalYesNo.querySelector(".tibou-analytix-modal-title");
    const myModalDescription = myModalYesNo.querySelector(".tibou-analytix-modal-description");

    myModalTitle.textContent = titleModal;
    myModalDescription.textContent = descriptionModal;


    const yesButton = myModalYesNo.querySelector("#tibou-analytix-YesNoModal-YesResponse");
    const noButton = myModalYesNo.querySelector("#tibou-analytix-YesNoModal-NoResponse");
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