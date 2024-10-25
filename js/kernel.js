async function AddMenusAndLodAllFile(menuHtml) {
    // Fetch the CSS content
    let contentCssFile = "";
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/taieb1919/scripts/refs/heads/main/styles/analytixStyle.css"
        );
        if (response.ok) {
            contentCssFile = await response.text();
        } else {
            console.error("Failed to load CSS file analytixStyle.");
        }
    } catch (error) {
        console.error("Error fetching CSS analytixStyle :", error);
    }

    // Apply the fetched CSS content
    const style = document.createElement("style");
    style.textContent = contentCssFile;
    document.head.appendChild(style);


    // Insert the menu into the page
    const menuContainer = document.createElement("div");
    menuContainer.innerHTML = menuHtml;
    menuContainer.style.position = "fixed";
    menuContainer.style.top = "40px";
    menuContainer.style.right = "40px";
    menuContainer.style.zIndex = "9999999999999"; // Ensure it stays on top of other elements
    document.body.appendChild(menuContainer);
}


function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.async = false;
        script.onload = () => {
            console.log(`Loaded: ${url}`);
            resolve();
        };
        script.onerror = () => reject(`Failed to load: ${url}`);
        document.head.appendChild(script);
    });
}

// Function to dynamically load a CSS file
function loadCSS(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.onload = () => resolve(console.log(`CSS Loaded: ${url}`));
        link.onerror = () => reject(`Failed to load CSS: ${url}`);
        document.head.appendChild(link);
    });
}

function ImportFonts() {
    // Define the URLs for the fonts
    const fontUrls = [
        "https://fonts.googleapis.com/css?family=Oswald:400,700",
        "https://fonts.googleapis.com/css?family=Nunito:400,700",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
    ];
    // Loop through each URL and create a <link> element
    fontUrls.forEach((url) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
    });


// Load jQuery 1.12.4, then Bootstrap JavaScript
    loadScript("https://code.jquery.com/jquery-1.12.4.min.js")
        .then(() => {
            // Avoid conflicts with existing jQuery versions
            const jq = jQuery.noConflict(true);
            window.jQuery = jq;
            window.$ = jq;

            // Now load Bootstrap JavaScript after jQuery
            return loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js");
        })
        .then(() => {
            console.log("Bootstrap and jQuery loaded.");

            // Verify if Bootstrap's modal function is available
            console.log("jQuery version:", jQuery.fn.jquery);
            console.log("Bootstrap modal function:", $.fn.modal);


        })
        .catch((error) => {
            console.error("Error loading scripts:", error);
        });

// Alternative URLs for Bootstrap 3.3.7 CSS
    const bootstrapCDN = "https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    const jsdelivrCDN = "https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css";

// Test loading from StackPath
    loadCSS(bootstrapCDN)
        .catch(() => loadCSS(jsdelivrCDN));
}

function AppendNotificationDiv() {
    const notificationBox = document.createElement("div");

    // Set the classes for styling
    notificationBox.className = "notification-box flex flex-col items-center justify-center fixed w-full z-50 p-3 tibou-analytix-toast-container";

    // Position the notification box at the bottom-right of the page
    notificationBox.style.position = "fixed";
    notificationBox.style.bottom = "20px";
    notificationBox.style.right = "20px";
    notificationBox.style.zIndex = "99999999999999";

    // Append the notification box to the body
    document.body.appendChild(notificationBox);

    AppendYesNoModal();
}




