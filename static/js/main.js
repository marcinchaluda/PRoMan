import { dom } from "./dom.js";
import { modalsInit } from "./modals.js";
import { deleteButtonsInit } from "./board_handler.js";
import { dragAndDropHandler} from "./drag_and_drop_handler.js";

function init() {
    dom.init();
    dom.loadBoards()
        .then(() => {
            modalsInit();
            deleteButtonsInit();
            setTimeout(() => dragAndDropHandler.init(), 500);
        });
}

init();
