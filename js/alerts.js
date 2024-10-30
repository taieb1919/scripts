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