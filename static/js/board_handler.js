import {dataHandler} from "./data_handler.js";
import {dom} from "./dom.js";

export function deleteButtonsInit() {
    const boardTitleBars = document.querySelectorAll('.board-container > .flex-row-start > .title');
    for (let boardTitleBar of boardTitleBars) {
        const parentLiElement = boardTitleBar.closest("li");
        const boardId = parentLiElement.getAttribute('boardid');

        const deleteButton = document.createElement('a');
        deleteButton.type = 'button';
        const icon = document.createElement('div');
        icon.classList.add('fas', 'fa-trash-alt');
        deleteButton.appendChild(icon);
        const buttonDescription = document.createElement('span');
        buttonDescription.innerText = ' Delete';
        deleteButton.appendChild(buttonDescription);
        deleteButton.classList.add();
        deleteButton.onclick = function(){
            dataHandler.deleteBoard(boardId, function(){
                dom.deleteBoard(parentLiElement);
            });
        }
        boardTitleBar.appendChild(deleteButton);
    }
}
