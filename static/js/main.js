import { dom } from "./dom.js";
import { modalsInit } from "./modals.js";
import { boardButtonsInit } from "./board_handler.js";


function init() {
    dom.init();
    dom.loadBoards()
        .then(() => {
            modalsInit();
            boardButtonsInit();
        });
}

init();
