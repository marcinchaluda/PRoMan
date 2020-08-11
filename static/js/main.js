import { dom } from "./dom.js";
import { modalsInit } from "./modals.js";
import { deleteBoardButtonsInit } from "./board_handler.js";


function init() {
    dom.init();
    dom.loadBoards()
        .then(() => {
            modalsInit();
            deleteBoardButtonsInit();
        });
}

init();
