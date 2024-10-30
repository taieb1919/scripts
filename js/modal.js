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