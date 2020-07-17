import { dom } from "./dom.js";
import { modals } from "./modals.js";
import { dragAndDropHandler} from "./drag_and_drop_handler.js";

function init() {
    dom.init();
    dom.loadBoards()
        .then(() => {
            modals.modalsInit();
            setTimeout(() => dragAndDropHandler.init(), 500);
        });
}

init();
