export class WinamaxEngine extends SiteEngineBase {

    BuildMenu() {
        return  `
        <ul id="tibou-analytix-menu">
    <li><button class="four">Extract All Bets</button></li>
    <li><button class="four">Extract Coupon bets</button></li>
    <li><button class="four">Get Favourites Game</button></li>
    <li><button class="five" id="tibou-analytix-menu-stop-button" >STOP</button></li>
        </ul>
    `;
    }
}