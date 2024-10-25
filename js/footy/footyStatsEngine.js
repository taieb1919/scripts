﻿// Helper function to format date to "26th October" style
function formatDateString(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });

    // Convert day to ordinal format (e.g., "26th")
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
        day % 10 === 2 && day !== 12 ? 'nd' :
            day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    return `${day}${suffix} ${month}`;
}

// Function to get date string based on parameter
function getDateRelativeToNow(relativeTo) {
    const now = new Date();

    switch (relativeTo.toLowerCase()) {
        case "today":
            return formatDateString(now);

        case "tomorrow":
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            return formatDateString(tomorrow);

        case "next 5 hours":
            const nextFiveHours = new Date(now);
            nextFiveHours.setHours(now.getHours() + 5);
            return `${formatDateString(nextFiveHours)} at ${nextFiveHours.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        default:
            return "Invalid parameter";
    }
}


// Filter function to keep only the divs with today's date
function filterBetWrappers(relativeTo) {
    const dateRelative=getDateRelativeToNow(relativeTo);
    
    const betWrappers = document.querySelectorAll('.betWrapper');

    betWrappers.forEach(wrapper => {
        const dateElement = wrapper.querySelector('.fas.fa-calendar + .data');
        if (dateElement && !dateElement.textContent.includes(dateRelative)) {
            // Remove the betWrapper if the date doesn't match today
            wrapper.remove();
        }
    });
}






function AddButtonEventListeners() {
    const myButton1 = document.getElementById("tibou-analytix-menu-btn1");
    myButton1.addEventListener("click", function () {
        ShowYesNoModal("Cleaning up games","you want keep only games for : ","Today","Tomorrow",function (choice){
            filterBetWrappers(choice.toLowerCase())
            SendSuccessMessage(choice);
            
        });
    });


    const myButton2 = document.getElementById("tibou-analytix-menu-btn2");
    myButton2.addEventListener("click", function () {
        SendErrorMessage("errorrrrr  !");
    });


    const myButton3 = document.getElementById("tibou-analytix-menu-btn3");
    myButton3.addEventListener("click", function () {
        SendWarningMessage("WARNNNNNNNNNNNN!");
    });


    const myButton4 = document.getElementById("tibou-analytix-menu-btn4");
    myButton4.addEventListener("click", function () {
        SendSuccessMessage("Winnnnnnnn");
    });

    const myButton5 = document.getElementById("tibou-analytix-menu-btn5");
    myButton5.addEventListener("click", function () {
        SendInfoMessage("good job");
    });
}


async function initMenuTopRight() {
    ImportFonts();
    
    var menuHtml = `
        <ul id="tibou-analytix-menu">
    <li><button id="tibou-analytix-menu-btn1" class="one">Filter predictions</button></li>
    <li><button id="tibou-analytix-menu-btn2" class="two">2</button></li>
    <li><button id="tibou-analytix-menu-btn3" class="three">3</button></li>
    <li><button id="tibou-analytix-menu-btn4" class="four">4</button></li>
    <li><button id="tibou-analytix-menu-btn5" class="five">5</button></li>
    
<!--    <li><button class="five" id="tibou-analytix-menu-stop-button" >STOP</button></li>-->
        </ul>
    `;
    await AddMenusAndLodAllFile(menuHtml);
    AppendNotificationDiv();

    AddButtonEventListeners();
}




