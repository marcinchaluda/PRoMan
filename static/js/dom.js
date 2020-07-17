import {dataHandler} from "./data_handler.js";
import {
    generateBoards,
    handleDetailButton,
    createTemplateOfBoardsHTML,
    assignTask,
    createNewTask,
    handleEvent,
    getLastButton,
    initNewColumnsWithDragAndDrop
} from './container_generator.js';

import {initTask} from './drag_and_drop_handler.js';


export let dom = {
    init: function () {
    },

    loadBoards: function () {
        return new Promise((resolve => {
            dataHandler.getBoards(function (boards) {
                dom.showBoards(boards);
                resolve();
            });
        }));
    },

    showBoards: function (boards) {
        const boardList = generateBoards(boards);
        const outerHtml = `
            <ul class="board-container flex-column">
                ${boardList}
            </ul>
        `;

        const boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        handleDetailButton();
    },

    loadCards: function (boardId) {
        dataHandler.getBoard(boardId, function (response) {
            dom.showCards(response);
        });
    },

    showCards: function (cards) {
        assignTask(cards);
    },

    displayNewBoard: function (title, board_id) {
        const boardContainer = document.querySelector('.board-container');
        const newBoard = createTemplateOfBoardsHTML(title, board_id);
        boardContainer.insertAdjacentHTML("beforeend", newBoard);

        handleEvent(getLastButton());
        initNewColumnsWithDragAndDrop(board_id);
    },

    displayNewCard: function (parent, title, taskId, taskOrderNumber) {
        const newTask = createNewTask(title, taskId, taskOrderNumber);
        initTask(newTask);
        parent.appendChild(newTask);
    },

};
