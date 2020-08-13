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
import {util} from "./util.js";


export let dom = {
    init: function () {
        dom.loadBoards();
        handleRefreshButton();
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
                const outerHtml = util.createElementWithClasses('ul', ['board-container', 'flex-column']);
                outerHtml.innerHTML = boardList;

                const boardsContainer = document.querySelector('#boards');
                boardsContainer.appendChild(outerHtml);

                handleDetailButton();
                fillBoardContent(boards);
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
                addBoardButtons(board_id);
                markPrivateBoard(board_details, board_id);
            })
    },

    displayNewCard: function (parent, title, taskId, taskOrderNumber) {
        const newTask = createNewTask(title, taskId, taskOrderNumber);
        initTask(newTask);
        parent.appendChild(newTask);
    },
};

function fillBoardContent(boards) {
    for (let board of boards) {
        dom.loadCards(board.id)

        if (board.board_private) {
            markPrivateBoard(board, board['id']);
        }

        initNewColumnsWithDragAndDrop(board.id);
        addBoardButtons(board.id);
    }
}
