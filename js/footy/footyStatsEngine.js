﻿function AddButtonEventListeners() {
    const myButton1 = document.getElementById("tibou-analytix-menu-btn1");
    myButton1.addEventListener("click", function () {
        ShowYesNoModal("Cleaning up games","you want keep only games for : ","Today","Tomorrow",function (choice){
            
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




