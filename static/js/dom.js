import {dataHandler} from "./data_handler.js";
import {
    createDeleteBoardButton,
    createEditBoardButton,
    createNewCardButton,
    createNewColumnButton
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
    handleRefreshButton,
    createNewColumn,
    stylePrivateBoard
} from './container_generator.js';
import {addFunctionToNewCardButton, modalsInit} from "./modals.js";
import {dragAndDropHandler, initTask, initColumn} from './drag_and_drop_handler.js';


export let dom = {
    init: function () {
        dom.loadBoards()
            .then(() => {
                modalsInit();
            });
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
                handleRefreshButton();
                for (let board of boards) {
                    this.loadCards(board.id)

                    if (board.board_private) {
                        markPrivateBoard(board, board['id']);
                    }

                    // handleEvent(getLastButton());
                    initNewColumnsWithDragAndDrop(board.id);

                    const boardButtons = document.querySelector(`li[boardid="${board.id}"] > .title`);
                    const boardTitleBar = document.querySelector(`li[boardid="${board.id}"]`);
                    const deleteButton = createDeleteBoardButton(board.id, boardTitleBar);
                    boardButtons.appendChild(deleteButton);
                    addFunctionToNewCardButton(board.id);

                    const editButton = createEditBoardButton(board.id);
                    boardButtons.appendChild(editButton);

                    const addColumnButton = createNewColumnButton(board.id);
                    boardButtons.appendChild(addColumnButton);

                }
            })

        // handleDetailButton();
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
                const deleteButton = createDeleteBoardButton(board_id, boardTitleBar);
                boardButtons.appendChild(deleteButton);

                addFunctionToNewCardButton(board_id);

                const editButton = createEditBoardButton(board_id);
                boardButtons.appendChild(editButton);

                const addColumnButton = createNewColumnButton(board_id);
                boardButtons.appendChild(addColumnButton);

                markPrivateBoard(board_details, board_id);
            })
    },

    displayNewCard: function (parent, title, taskId, taskOrderNumber) {
        const newTask = createNewTask(title, taskId, taskOrderNumber);
        initTask(newTask);
        parent.appendChild(newTask);
    },

    displayNewColumn: function(data) {
        const cardsContainer = document.querySelector(`div[containerboardid="${data.board_id}"]`);
        const newColumn = createNewColumn(data);

        initColumn(newColumn);

        cardsContainer.appendChild(newColumn);
    }
};
