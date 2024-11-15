function BuildMenu() {
    return `
        <div class="card-TaiebAnalytix-Menu-Card">
    <ul class="list-TaiebAnalytix-Menu-Card">
        <li class="element-TaiebAnalytix-Menu-Card"   id="card-TaiebAnalytix-Menu-btn1">
                <span>
                    <i class="fa-solid fa-up-right-from-square"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Extract Played ticket</p>
        </li>
        <li class="element-TaiebAnalytix-Menu-Card" id="card-TaiebAnalytix-Menu-btn2">
             <span>
                    <i class="fa-regular fa-heart"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Favourite Game Extract</p>
        </li>
        <li class="element-TaiebAnalytix-Menu-Card" id="card-TaiebAnalytix-Menu-btn3">
                <span>
                    <i class="fa-solid fa-receipt"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Extract Current Coupon</p>
        </li>
        
        <li class="element-TaiebAnalytix-Menu-Card " id="card-TaiebAnalytix-Menu-btn4">
                <span>
                    <i class="fa-regular fa-money-bill-1"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Set Stake for All closed tickets</p>
        </li>
    </ul>
    <div class="separator-TaiebAnalytix-Menu-Card"></div>
    <ul class="list-TaiebAnalytix-Menu-Card">
        
        <li class="element-TaiebAnalytix-Menu-Card delete-TaiebAnalytix-Menu-Card" id="card-TaiebAnalytix-Menu-btn5">
                <span>
                    <i class="fa-regular fa-circle-stop"></i>
                </span>
            <p class="label-TaiebAnalytix-Menu-Card">Stop Process</p>
        </li>
    </ul>
    <div class="separator-TaiebAnalytix-Menu-Card"></div>
</div>
    `;
}


function AddButtonEventListeners() {
    const myButton1 = document.getElementById("card-TaiebAnalytix-Menu-btn1");
    myButton1.onclick = () => {
        SendSuccessMessage("Hello");

    };

    const myButton2 = document.getElementById("card-TaiebAnalytix-Menu-btn2");
    myButton2.onclick = async () => {

        await ExtractWinAMaxFavouriteGames()
    };
    const myButton3 = document.getElementById("card-TaiebAnalytix-Menu-btn3");
    myButton3.onclick = () => {
        SendErrorMessage("Hello ssqd sqds qsd sqdsq dqlmkkqsfd qsdklmqes  sqdqklqdlqk qd  qsksqd kmùdsqsqd qdqkqs" +
            "qdùmùdlkmùdmls ùkqsdmùlksdq mùlkqsdl sqùmkmùdkqds ");

    };
    const myButton4 = document.getElementById("card-TaiebAnalytix-Menu-btn4");
    myButton4.onclick = () => {
        SetStakeForAllPlayedTicket();

    };

    const myButton5 = document.getElementById("card-TaiebAnalytix-Menu-btn5");
    myButton5.addEventListener("click", function () {

        function ExtractingBetsHistoryFullProcess() {
            openMainModal();
        }

        ExtractingBetsHistoryFullProcess()

    });
}
