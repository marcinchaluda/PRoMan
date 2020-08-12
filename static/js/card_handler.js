import {dataHandler} from "./data_handler.js";
import {util} from "./util.js";

export function createDeleteCardButton(task, cardId) {
    const deleteButton = util.createElementWithClasses('a', ['card-trash']);
    deleteButton.type = 'button';

    const icon = util.createElementWithClasses('i', ['fas', 'fa-trash-alt']);
    deleteButton.appendChild(icon);

    deleteButton.onclick = function () {
        dataHandler.deleteCard(cardId, function () {
            task.remove();
        });
    }
    return deleteButton;
}

export function createEditCardButton(cardId) {
    const editButton = util.createElementWithClasses('a', ['card-trash']);
    editButton.type = 'button';

    const icon = util.createElementWithClasses('i', ['fas', 'fa-edit']);
    editButton.appendChild(icon);

    editButton.onclick = function () {
        const editCardModal = document.querySelector('#edit-card-modal');
        editCardModal.style.display = "block";
        localStorage.setItem('activeCard', cardId);
    }
    return editButton;
}