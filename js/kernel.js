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


function ImportFonts() {
    // Define the URLs for the fonts
    const fontUrls = [
        "https://fonts.googleapis.com/css?family=Oswald:400,700",
        "https://fonts.googleapis.com/css?family=Nunito:400,700",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
    ];
  /*  
    const scripts = [
        {
            src: "https://code.jquery.com/jquery-1.12.0.min.js",
            integrity: "", // No integrity attribute provided for this script
            crossorigin: ""
        },
        {
            src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
            integrity: "sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS",
            crossorigin: "anonymous"
        }
    ];
*/
    // Loop through each URL and create a <link> element
    fontUrls.forEach((url) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
    });

/*
    scripts.forEach(({ src, integrity, crossorigin }) => {
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.async = false; // Ensures scripts load in order

        // Add integrity and crossorigin if provided
        if (integrity) script.integrity = integrity;
        if (crossorigin) script.crossOrigin = crossorigin;

        document.head.appendChild(script);
    });*/
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

