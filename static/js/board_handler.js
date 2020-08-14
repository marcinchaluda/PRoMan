import {dataHandler} from "./data_handler.js";
import {util} from "./util.js";

export function addBoardButtons(boardId) {
    const boardButtons = document.querySelector(`li[boardid="${boardId}"] > .title`);
    const boardTitleBar = document.querySelector(`li[boardid="${boardId}"]`);

    boardButtons.appendChild(createNewCardButton(boardId));
    boardButtons.appendChild(createDeleteBoardButton(boardId, boardTitleBar));
    boardButtons.appendChild(createEditBoardButton(boardId));
    boardButtons.appendChild(createNewColumnButton(boardId));
}

function createNewCardButton(boardId) {
    const newCardButton = util.addButton(['fas', 'fa-plus-circle'], 'New card');

    newCardButton.onclick = function () {
        const newCardModal = document.getElementById('new-card-modal');
        newCardModal.style.display = "block";

        localStorage.setItem('activeBoard', boardId);
    }
    return newCardButton;
}

function createDeleteBoardButton(boardId, elementToDelete) {
    const deleteButton = util.addButton(['fas', 'fa-trash-alt'], 'Delete');

    deleteButton.onclick = function () {
        dataHandler.deleteBoard(boardId, function () {
            const columns = elementToDelete.nextElementSibling;
            elementToDelete.remove();
            columns.remove()
        });
    }
    return deleteButton;
}

function createEditBoardButton(boardId) {
    const editButton = util.addButton(['fas', 'fa-edit'], 'Edit');

    editButton.onclick = function () {
        const editBoardModal = document.querySelector('#edit-board-modal')
        editBoardModal.style.display = "block";
        localStorage.setItem('activeBoard', boardId);
    }
    return editButton;
}

function createNewColumnButton(boardId) {
    const newCardButton = util.addButton(['fas', 'fa-columns'], 'New column');

    newCardButton.onclick = function () {
        const newColumnModal = document.getElementById('new-column-modal');
        newColumnModal.style.display = "block";

        localStorage.setItem('activeBoard', boardId);
    }
    return newCardButton;
}
