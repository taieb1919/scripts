function sendNotification(type, text) {

    let notificationBox = document.querySelector(".notification-box");
var toastHtml= `
        <div class="tibou-analytix-toast tibou-analytix-active">
            <div class="tibou-analytix-toast-content">
                <i class="fas fa-solid tibou-analytix-check"></i>
                <div class="tibou-analytix-message">
                    <span class="tibou-analytix-text tibou-analytix-text-1">Success</span>
                    <span class="tibou-analytix-text tibou-analytix-text-2">Your changes have been saved</span>
                </div>
            </div>
            <i class="fa-solid fa-xmark tibou-analytix-close"></i>
            <div class="tibou-analytix-progress tibou-analytix-active"></div>
        </div>
    `
    
    const alerts = {
        info: {
            Icon:"fa-info",
            color: "info"
        },
        error: {
            Icon:"fa-bug",
            color: "error"
        },
        warning: {
            Icon:"fa-triangle-exclamation",
            color: "warning"
        },
        success: {
            Icon:"fa-check",
            color: "success"
        }
    };
    let component = document.createElement("div");
    component.innerHTML = toastHtml;

    notificationBox.appendChild(component);
    const toast = component.querySelector(".tibou-analytix-toast");
    (progress = component.querySelector(".tibou-analytix-progress")),
        (textSpan = component.querySelector(".tibou-analytix-text-2")),
        (iconSelector = component.querySelector(".tibou-analytix-check")),
        (closeIcon = component.querySelector(".tibou-analytix-close"));

    textSpan.textContent=text;
    
    let timer1, timer2;

    iconSelector.classList.add(alerts[type].Icon);
    iconSelector.classList.add(alerts[type].color);
    
    toast.classList.add("tibou-analytix-active");
    progress.classList.add("tibou-analytix-active");
    progress.classList.add(alerts[type].color);

    timer1 = setTimeout(() => {
        toast.classList.remove("tibou-analytix-active");
    }, 5000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
        progress.classList.remove("tibou-analytix-active");
    }, 5300);


    closeIcon.addEventListener("click", () => {
        toast.classList.remove("tibou-analytix-active");

        setTimeout(() => {
            progress.classList.remove("tibou-analytix-active");
        }, 300);

        clearTimeout(timer1);
        clearTimeout(timer2);
    });

    
    //component.className = `relative flex items-center bg-${alerts[type].color} text-white text-sm font-bold px-4 py-3 rounded-md opacity-0 transform transition-all duration-500 mb-1`;

    setTimeout(() => {
        notificationBox.removeChild(component);
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