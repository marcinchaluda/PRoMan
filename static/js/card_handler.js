import {dataHandler} from "./data_handler.js";
import {createElementWithClasses} from "./modals.js";

export function deleteCardButtonsInit() {
    const tasks = document.querySelectorAll('.task');
    console.log(tasks);
    for (let task of tasks) {
        const cardId = task.getAttribute('task-id');
        task.appendChild(createDeleteCardButton(task, cardId));
    }
}

export function createDeleteCardButton(task, cardId) {
    const deleteButton = document.createElement('a');
    deleteButton.type = 'button';

    const icon = createElementWithClasses('i', ['fas', 'fa-trash-alt']);
    deleteButton.appendChild(icon);

    deleteButton.onclick = function () {
        dataHandler.deleteCard(cardId, function () {
            task.remove();
        });
    }
    return deleteButton;
}