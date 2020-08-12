import {dataHandler} from "./data_handler.js";
import {createElementWithClasses} from "./modals.js";

export function boardButtonsInit() {
    const boardTitleBars = document.querySelectorAll('.board-container > .flex-row-start > .title');
    for (let boardTitleBar of boardTitleBars) {
        const parentLiElement = boardTitleBar.closest("li");
        const boardId = parentLiElement.getAttribute('boardid');

        boardTitleBar.appendChild(createDeleteBoardButton(boardId, parentLiElement));
        boardTitleBar.appendChild(createEditBoardButton(boardId));
    }
}

export function createDeleteBoardButton(boardId, elementToDelete) {
    const deleteButton = addButton(['fas', 'fa-trash-alt'],'Delete');

    deleteButton.onclick = function () {
        dataHandler.deleteBoard(boardId, function () {
            const columns = elementToDelete.nextElementSibling;
            elementToDelete.remove();
            columns.remove()
        });
    }
    return deleteButton;
}

export function createEditBoardButton(boardId) {
    const editButton = addButton(['fas', 'fa-edit'],'Edit');

    editButton.onclick = function () {
        const editBoardModal = document.querySelector('#edit-board-modal')
        editBoardModal.style.display = "block";
        localStorage.setItem('activeBoard', boardId);
    }
    return editButton;
}

function addButton(classes, descriptionText) {
    const button = addButtonElement();
    const icon = createElementWithClasses('i', classes);
    button.appendChild(icon);
    button.appendChild(addDescription(descriptionText));

    return button;
}

function addButtonElement() {
    const button = document.createElement('a');
    button.type = 'button';

    return button;
}

function addDescription(text) {
    const buttonDescription = document.createElement('span');
    buttonDescription.innerText = text;

    return buttonDescription;
}