import { dom } from "./dom.js";
import { modals } from "./modals.js";

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards()
        .then(() => {
            modals.mojaFunckjaTestowa()
        });

}

init();
