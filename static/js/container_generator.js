import {initColumns} from "./drag_and_drop_handler.js";
import {
    createDeleteCardButton,
    createEditCardButton
} from "./card_handler.js";
import {dataHandler} from "./data_handler.js";

const defaultColumns = ['New', 'In Progress', 'Testing', 'Done'];

export let generator = {
    generateBoards: function (boards) {
        return new Promise(resolve => {
            let boardList = '';

            (Object.keys(boards).length === 0) ? resolve(boardList) : generateBoardList(resolve, boardList, boards);
        });
    },

    createTemplateOfBoardsHTML: function (title, board_private, id, isNewBoard = false) {
        return new Promise(resolve => {
            board_private = board_private ? 'true' : 'false';
            const boardDetailsPromise = this.generateBoardDetails(id, isNewBoard);
            boardDetailsPromise.then(boardDetails => {
                const boardsTemplate = getBoardTemplate(title, board_private, id, boardDetails);
                resolve(boardsTemplate);
            });
        });
    },

    generateBoardDetails: function (id, isNewBoard) {
        return new Promise(resolve => {
            (isNewBoard) ? this.generateDefaultColumns(resolve, id).then(r => resolve()) : generateColumns(resolve, id);
        });
    },

    generateDefaultColumns: async function (resolve, id) {
        let cardList = '';
        for (let [index, columnName] of defaultColumns.entries()) {
            const columnData = {
                title: columnName,
                board_id: id,
                order_number: index
            }
            await this.createNewColumnPromise()
                .then(statusId => {
                    cardList += getColumn(columnData, statusId);

                    if (index === defaultColumns.length - 1) {
                        resolve(cardList);
                    }
                });
        }
    },

    getColumnsByBoardId: function (id) {
        return new Promise(resolve => {
            dataHandler.getColumnsByBoardId(id, response => {
                const columns = response.columns;
                resolve(columns);
            });
        });
    },

    createNewColumnPromise: function (columnData) {
        return new Promise(resolve => {
            dataHandler.createColumn(columnData, (response) => {
                let statusId = response.id;
                resolve(statusId);
            });
        });
    },

    handleDetailButton: function () {
        const detailBtn = document.querySelectorAll('.detail-button');

        detailBtn.forEach(button => {
            generator.handleEvent(button);
        });
    },

    handleRefreshButton: function () {
        const refreshButton = document.getElementById('refresh-button');
        refreshButton.addEventListener('click', () => window.location.reload());
    },

    assignCards: function (cards) {
        cards.forEach(card => {
            let column = document.querySelector(`.cell[status-id="${card.status_id}"]`);
            this.createColumn(column.querySelector(".tasks"), card);
        });
    },

    createColumn: function (column, card) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.setAttribute('task-id', card.id);
        task.setAttribute('order-number', card.order_number);
        //TODO extract to new function during refactor
        const taskTitle = document.createElement('div');
        taskTitle.classList.add('task-title');
        taskTitle.textContent = card.title;
        task.appendChild(taskTitle);

        task.appendChild(addButtonsToCard(task, card.id));

        column.appendChild(task);
    },

    getLastButton: function () {
        const buttons = [...document.querySelectorAll('.board-details > i')];
        return buttons[buttons.length - 1];
    },

    initNewColumnsWithDragAndDrop: function (board_id) {
        initColumns(document.querySelectorAll(`div[containerBoardId="${board_id}"] .tasks`));
    },

    createNewTask: function (title, taskId, taskNumberOrder) {
        const task = document.createElement('div');
        //TODO extract to new function during refactor
        const taskTitle = document.createElement('div');
        taskTitle.classList.add('task-title');
        taskTitle.textContent = title;
        task.appendChild(taskTitle);
        task.classList.add('task');
        task.setAttribute('task-id', taskId);
        task.setAttribute('order-number', taskNumberOrder);

        task.appendChild(addButtonsToCard(task, taskId));

        return task;
    },

    markPrivateBoard: function (board_details, board_id) {
        if (board_details.board_private === true) {
            const boardTitleContainer = document.querySelector(`li[boardId="${board_id}"] .col-title`);
            const lockIcon = '<i class="fas fa-user-lock"></i>';
            const icons = document.getElementsByClassName('div.title fas fa-user-lock');
            if (icons.length === 0) {
                boardTitleContainer.insertAdjacentHTML("afterbegin", lockIcon);
            }
        }
        stylePrivateBoard(board_details, board_id);
    },

    handleEvent: function (button) {
        button.addEventListener('click', function () {
            button.getAttribute('boardId');
            const cardsContainer = button.parentElement.parentElement.nextElementSibling;
            cardsContainer.classList.toggle('show');

            button.className = button.classList.contains('fa-ellipsis-h') ?
                'detail-button fas fa-times' : 'detail-button fas fa-ellipsis-h';
        });
    }
}


function generateColumns(resolve, id) {
    let cardList = '';
    generator.getColumnsByBoardId(id)
        .then(result => {
            const columns = result;
            let columnIndex = 0;
            for (let column of columns) {
                cardList += `
                <div class='cell' status-id="${column.id}" status-order-number='${column.order_number}'>
                    <h3>${column.title}</h3>
                    <div class="tasks flex-column" cardId="${id}"></div>
                </div>
                `;
                if (columnIndex === Object.keys(columns).length - 1) {
                    resolve(cardList);
                }
                columnIndex++;
            }
        });
}


function stylePrivateBoard(board_details, board_id) {
    if (board_details.board_private === true) {
        const li = document.querySelector(`li[boardId="${board_id}"]`);
        const cards = document.querySelectorAll(`div[containerBoardId="${board_id}"] .cell h3`);

        li.classList.add('private');
        cards.forEach(card => {
            card.classList.add('private');
        });
    }
}

function addButtonsToCard(elementToDelete, cardId) {
    const buttonPanel = document.createElement('div');
    buttonPanel.classList.add('button-panel');
    buttonPanel.appendChild(createDeleteCardButton(elementToDelete, cardId));
    buttonPanel.appendChild(createEditCardButton(cardId));

    return buttonPanel;
}

function generateBoardList(resolve, boardList, boards) {
    (async () => {
        for (let board of boards) {
            const templateOfBoardsPromise = generator.createTemplateOfBoardsHTML(board.title, board.board_private, board.id);
            await templateOfBoardsPromise.then(result => {
                boardList += result;
            });
        }
        return resolve(boardList);
    })();
}

function getColumn(columnData, statusId) {
    return `
            <div class='cell' status-id="${statusId}" status-order-number='${columnData.order_number}'>
                <h3>${columnData.title}</h3>
                <div class="tasks flex-column" cardId="${columnData.board_id}"></div>
            </div>
           `;
}

function getBoardTemplate(title, board_private, id, boardDetails) {
    return `
            <li class="flex-row-start" boardId="${id}" boardPrivate="${board_private}">
                <div class="title flex-row-start">
                    <div class="col-title"><h3>${title}</h3></div>                       
                </div>
                <div class="board-details flex-row-end">
                    <i class="detail-button fas fa-ellipsis-h" boardId="${id}"></i>
                </div>
            </li>
            <div class="cards-container flex-row-start hide-details" containerBoardId="${id}">${boardDetails}</div>
           `;
}