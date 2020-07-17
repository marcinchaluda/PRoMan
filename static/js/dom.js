// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import { generateBoards, handleDetailButton, createTemplateOfBoardsHTML, assignTask, createNewTask } from './container_generator.js'
import { initTask } from './drag_and_drop_handler.js'
import { handleEvent, getLastButton, initNewColumnsWithDragAndDrop } from "./container_generator.js";

export let dom = {
    init: function () {

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        return new Promise((resolve => {
            dataHandler.getBoards(function(boards){
                dom.showBoards(boards);
                resolve();
            });
        }))

    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        const boardList = generateBoards(boards);

        const outerHtml = `
            <ul class="board-container flex-column">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        document.body.appendChild(boardsContainer);
        handleDetailButton();
    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
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
    // here comes more features
    displayNewCard: function (parent, title, taskId, taskOrderNumber) {
        const newTask = createNewTask(title, taskId, taskOrderNumber);
        initTask(newTask);
        parent.appendChild(newTask);
    },
    // here comes more features
};
