import { dom } from "./dom.js";
import { dragAndDropHandler} from "./drag_and_drop_handler.js";

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards()
        .then(() => {
            dragAndDropHandler.init();
        });
}

init();
