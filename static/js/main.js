import { dom } from "./dom.js";
import { modalsInit } from "./modals.js";
import { deleteButtonsInit } from "./board_handler.js";

function init() {
    dom.init();
    dom.loadBoards()
        .then(() => {
            modalsInit();
            deleteButtonsInit();
        });
    dom.handleFormButtons();
}

init();
