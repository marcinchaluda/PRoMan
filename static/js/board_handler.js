import {dataHandler} from "./data_handler.js";
import {createElementWithClasses} from "./modals.js";

export function deleteButtonsInit() {
    const boardTitleBars = document.querySelectorAll('.board-container > .flex-row-start > .title');
    for (let boardTitleBar of boardTitleBars) {
        const parentLiElement = boardTitleBar.closest("li");
        const boardId = parentLiElement.getAttribute('boardid');

        boardTitleBar.appendChild(createDeleteBoardButton(boardId, parentLiElement));
    }
}

export function createDeleteBoardButton(boardId, elementToDelete) {
    const deleteButton = document.createElement('a');
    deleteButton.type = 'button';

    const icon = createElementWithClasses('i', ['fas', 'fa-trash-alt']);
    deleteButton.appendChild(icon);

    const buttonDescription = document.createElement('span');
    buttonDescription.innerText = 'Delete';
    deleteButton.appendChild(buttonDescription);

    deleteButton.onclick = function () {
        dataHandler.deleteBoard(boardId, function () {
            const columns = elementToDelete.nextElementSibling;
            elementToDelete.remove();
            columns.remove()
        });
    }
    return deleteButton;
}
