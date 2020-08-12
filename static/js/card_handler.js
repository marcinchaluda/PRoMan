import {dataHandler} from "./data_handler.js";
import {util} from "./util.js";

export function createDeleteCardButton(task, cardId) {
    const deleteButton = util.addButton(['fas', 'fa-trash-alt']);
    deleteButton.classList.add('card-trash');

    deleteButton.onclick = function () {
        dataHandler.deleteCard(cardId, function () {
            task.remove();
        });
    }
    return deleteButton;
}

export function createEditCardButton(cardId) {
    const editButton = util.addButton(['fas', 'fa-edit']);
    editButton.classList.add('card-trash');

    editButton.onclick = function () {
        const editCardModal = document.querySelector('#edit-card-modal');
        editCardModal.style.display = "block";
        localStorage.setItem('activeCard', cardId);
    }
    return editButton;
}