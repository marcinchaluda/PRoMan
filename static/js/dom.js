import {dataHandler} from "./data_handler.js";
import {
    addBoardButtons
} from "./board_handler.js";
import {
    generateBoards,
    handleDetailButton,
    createTemplateOfBoardsHTML,
    createNewTask,
    handleEvent,
    getLastButton,
    initNewColumnsWithDragAndDrop,
    assignCards,
    markPrivateBoard,
    handleRefreshButton
} from './container_generator.js';

import {dragAndDropHandler, initTask} from './drag_and_drop_handler.js';


export let dom = {
    init: function () {
        dom.loadBoards()
    },

    loadBoards: function () {
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
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
                handleRefreshButton();
                for (let board of boards) {
                    this.loadCards(board.id)

                    if (board.board_private) {
                        markPrivateBoard(board, board['id']);
                    }

                    initNewColumnsWithDragAndDrop(board.id);

                    const boardButtons = document.querySelector(`li[boardid="${board.id}"] > .title`);
                    const boardTitleBar = document.querySelector(`li[boardid="${board.id}"]`);

                    addBoardButtons(boardButtons, board.id, boardTitleBar);
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

    displayNewBoard: function (board_details, board_id) {

        const newBoardPromise = createTemplateOfBoardsHTML(board_details['title'], board_details['board_private'], board_id, true);
        newBoardPromise
            .then(newBoard => {
                const boardContainer = document.querySelector('.board-container');
                boardContainer.insertAdjacentHTML("beforeend", newBoard);
                handleEvent(getLastButton());
                initNewColumnsWithDragAndDrop(board_id);

                const boardButtons = document.querySelector(`li[boardid="${board_id}"] > .title`);
                const boardTitleBar = document.querySelector(`li[boardid="${board_id}"]`);

                addBoardButtons(boardButtons, board_id, boardTitleBar);
                markPrivateBoard(board_details, board_id);
            })
    },

    displayNewCard: function (parent, title, taskId, taskOrderNumber) {
        const newTask = createNewTask(title, taskId, taskOrderNumber);
        initTask(newTask);
        parent.appendChild(newTask);
    },
};
