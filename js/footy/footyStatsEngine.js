function reorderBetWrappers() {
    const container = document.querySelector('.predictionsList'); // Adjust to the correct container selector
    const betWrappers = Array.from(document.querySelectorAll('.betWrapper'));

    // Sort betWrapper elements by parsed date
    betWrappers.sort((a, b) => {
        const dateA = parseDate(a.querySelector('.fas.fa-calendar + .data').textContent.trim());
        const dateB = parseDate(b.querySelector('.fas.fa-calendar + .data').textContent.trim());
        return dateA - dateB;
    });

    // Clear the container
    container.innerHTML = '';

    // Reinsert sorted betWrapper elements
    betWrappers.forEach(wrapper => container.appendChild(wrapper));
}

// Helper function to parse the date (same as before)
function parseDate(dateString) {
    console.log("Original date string:", dateString);

    // Remove ordinal suffixes (st, nd, rd, th) from the day
    dateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');

    // Extract date and time components
    const [datePart, timePart] = dateString.split("at").map(s => s.trim());
    const [day, monthName] = datePart.split(" ");
    const year = new Date().getFullYear(); // Use current year

    // Extract hour and minute, adjust for AM/PM
    let [time, meridian] = timePart.split(/(am|pm)/i).map(s => s.trim());
    let [hours, minutes] = time.split(":").map(Number);
    if (meridian.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (meridian.toLowerCase() === 'am' && hours === 12) hours = 0;

    // Convert month name to month index (e.g., October -> 9 for October)
    const monthIndex = new Date(`${monthName} 1`).getMonth();

    // Create Date object with extracted components
    const parsedDate = new Date(year, monthIndex, Number(day), hours, minutes);

    console.log("Parsed Date object:", parsedDate);
    return parsedDate;
}


// Helper function to format date to "26th October" style
// Helper function to format date with specific locale and ordinal suffix
function formatDateString(date, locale = 'en') {
    const day = date.getDate();
    const month = date.toLocaleString(locale, {month: 'long'});

    // Add ordinal suffix (st, nd, rd, th) to day
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
        day % 10 === 2 && day !== 12 ? 'nd' :
            day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    return `${day}${suffix} ${month}`;
}

// Function to get date string based on parameter and locale
function getDateRelativeToNow(relativeTo, locale = 'en') {
    const now = new Date();

    switch (relativeTo.toLowerCase()) {
        case "today":
            return formatDateString(now, locale);

        case "tomorrow":
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            return formatDateString(tomorrow, locale);

        case "next 5 hours":
            const nextFiveHours = new Date(now);
            nextFiveHours.setHours(now.getHours() + 5);
            return `${formatDateString(nextFiveHours, locale)} at ${nextFiveHours.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })}`;

        default:
            return "Invalid parameter";
    }
}


// Filter function to keep only the divs with today's date
function filterBetWrappers(choice) {
    const dateRelative = getDateRelativeToNow(choice); // or "tomorrow", "next 5 hours", etc.
    const betWrappers = document.querySelectorAll('.betWrapper');

    betWrappers.forEach(wrapper => {
        // Locate the .data div that follows the .fa-calendar icon
        const calendarIcon = wrapper.querySelector('.fas.fa-calendar');
        const dateElement = calendarIcon ? calendarIcon.parentElement.querySelector('.data') : null;

        if (dateElement) {
            const dateText = dateElement.textContent.trim(); // Remove any extra spaces
            console.log("Date in element:", dateText);
            console.log("Expected date:", dateRelative);

            if (!dateText.includes(dateRelative)) {
                // Remove the betWrapper if the date doesn't match the expected date
                wrapper.remove();
            }
        }

        // Find the .betHeader within the current .betWrapper
        const betHeader = wrapper.querySelector('.betHeader');

        // Check if .betHeader exists and does NOT have the 'active' class
        if (betHeader && !betHeader.classList.contains('active')) {
            // Trigger a click on the .betHeader element
            betHeader.click();
        }
    });
    

    reorderBetWrappers();
}


function AddButtonEventListeners() {
    const myButton1 = document.getElementById("tibou-analytix-menu-btn1");
    myButton1.addEventListener("click", function () {
        ShowYesNoModal("Cleaning up games", "you want keep only games for : ", "Today", "Tomorrow", function (choice) {
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




