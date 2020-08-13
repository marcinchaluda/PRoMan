import {dataHandler} from "./data_handler.js";
import {createDeleteBoardButton} from "./board_handler.js";
import {
    generateBoards,
    handleDetailButton,
    createTemplateOfBoardsHTML,
    createNewTask,
    handleEvent,
    getLastButton,
    initNewColumnsWithDragAndDrop,
    assignCards
} from './container_generator.js';
import {addFunctionToNewCardButtton} from "./modals.js";
import {dragAndDropHandler, initTask} from './drag_and_drop_handler.js';


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
        const boardListPromise = generateBoards(boards);
        boardListPromise
            .then(boardList => {
                const outerHtml = `
                    <ul class="board-container flex-column">
                        ${boardList}
                    </ul>
                `;
                let boardsContainer = document.querySelector('#boards');
                boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
                handleDetailButton();

                for (let board of boards) {
                    this.loadCards(board.id)

                    handleEvent(getLastButton());
                    initNewColumnsWithDragAndDrop(board.id);

                    const boardButtons = document.querySelector(`li[boardid="${board.id}"] > .title`);
                    const boardTitleBar = document.querySelector(`li[boardid="${board.id}"]`);
                    const deleteButton = createDeleteBoardButton(board.id, boardTitleBar);
                    boardButtons.appendChild(deleteButton);
                    addFunctionToNewCardButtton(board.id);
                }
            })


    },

    loadCards: function (boardId) {
        dataHandler.getCardsByBoardId(boardId, function (response) {
            dom.showCards(response);
            dragAndDropHandler.init();
        });
    },

    showCards: function (cards) {
        assignCards(cards);
    },

    displayNewBoard: function (title, board_id) {
        const newBoardPromise = createTemplateOfBoardsHTML(title, board_id, true);
        newBoardPromise
            .then(newBoard => {
                const boardContainer = document.querySelector('.board-container');
                boardContainer.insertAdjacentHTML("beforeend", newBoard);
                handleEvent(getLastButton());
                initNewColumnsWithDragAndDrop(board_id);

                const boardButtons = document.querySelector(`li[boardid="${board_id}"] > .title`);
                const boardTitleBar = document.querySelector(`li[boardid="${board_id}"]`);
                const deleteButton = createDeleteBoardButton(board_id, boardTitleBar);
                boardButtons.appendChild(deleteButton);
                addFunctionToNewCardButtton(board_id);
            })
    },

    displayNewCard: function (parent, title, taskId, taskOrderNumber) {
        const newTask = createNewTask(title, taskId, taskOrderNumber);
        initTask(newTask);
        parent.appendChild(newTask);
    },
};
