import { dom } from "./dom.js";
import { modals } from "./modals.js";
import { dragAndDropHandler} from "./drag_and_drop_handler.js";

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards()
        .then(() => {
            modals.modalsInit();
            setTimeout(() => dragAndDropHandler.init(), 500);
        });
}

init();
