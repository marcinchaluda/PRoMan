import {dataHandler} from "./data_handler.js";
import {util} from "./util.js";

// export function boardButtonsInit() {
//     const boardTitleBars = document.querySelectorAll('.board-container > .flex-row-start > .title');
//     for (let boardTitleBar of boardTitleBars) {
//         const parentLiElement = boardTitleBar.closest("li");
//         const boardId = parentLiElement.getAttribute('boardid');
//
//         boardTitleBar.appendChild(createDeleteBoardButton(boardId, parentLiElement));
//         boardTitleBar.appendChild(createEditBoardButton(boardId));
//     }
// }

export function createNewCardButton(boardId) {
    const newCardButton = util.addButton(['fas', 'fa-plus-circle'], 'New card');

    newCardButton.onclick = function () {
        const newCardModal = document.getElementById('new-card-modal');
        newCardModal.style.display = "block";

        localStorage.setItem('activeBoard', boardId);
    }
    return newCardButton;
}

export function createDeleteBoardButton(boardId, elementToDelete) {
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

export function createEditBoardButton(boardId) {
    const editButton = util.addButton(['fas', 'fa-edit'], 'Edit');

    editButton.onclick = function () {
        const editBoardModal = document.querySelector('#edit-board-modal')
        editBoardModal.style.display = "block";
        localStorage.setItem('activeBoard', boardId);
    }
    return editButton;
}
