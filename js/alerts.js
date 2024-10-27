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
var toastHtml= `
       <div class="toast active">
  
  <div class="toast-content">
    <i class="fas fa-solid  check"></i>

    <div class="message">
      <span class="text text-1">Success</span>
      <span class="text text-2">Your changes has been saved</span>
    </div>
  </div>
  <i class="fa-solid fa-xmark close"></i>

  <!-- Remove 'active' class, this is just to show in Codepen thumbnail -->
  <div class="progressToast active"></div>
</div>
    `
    
    const alerts = {
        info: {
            Icon:"fa-info",
            color: "info",
            Title: "Information"
        },
        error: {
            Icon:"fa-bug",
            color: "error",
            Title: "Error"
        },
        warning: {
            Icon:"fa-triangle-exclamation",
            color: "warning",
            Title: "Warning"
        },
        success: {
            Icon:"fa-check",
            color: "success",
            Title: "Success"
        }
    };
    let component = document.createElement("div");
    component.innerHTML = toastHtml;
    
    
    notificationBox.appendChild(component);
    const toast = component.querySelector(".toast");
    (progress = component.querySelector(".progressToast")),
        (titleSpan = component.querySelector(".text-1")),
        (textSpan = component.querySelector(".text-2")),
        (iconSelector = component.querySelector(".check")),
        (closeIcon = component.querySelector(".close"));

    textSpan.textContent=text;
    titleSpan.textContent=alerts[type].Title;
    
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