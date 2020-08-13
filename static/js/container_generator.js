import {initColumns} from "./drag_and_drop_handler.js";
import {
    createDeleteCardButton,
    createEditCardButton
} from "./card_handler.js";
import {dataHandler} from "./data_handler.js";
import {util} from "./util.js";

const defaultColumns = ['New', 'In Progress', 'Testing', 'Done'];

export let generator = {
    generateBoards: function (boards) {
        return new Promise(resolve => {
            let boardList = '';
            let boardIndex = 0;
            if (Object.keys(boards).length === 0) {
                resolve(boardList);
            } else {
                for (let board of boards) {
                    const templateOfBoardsPromise = this.createTemplateOfBoardsHTML(board.title, board.board_private, board.id);
                    templateOfBoardsPromise.then(result => {
                        boardList += result;
                        if (boardIndex === Object.keys(boards).length - 1) {
                            resolve(boardList);
                        }
                        boardIndex++;
                    });
                }
            }
        });
    },

    createTemplateOfBoardsHTML: function (title, board_private, id, isNewBoard = false) {
        return new Promise(resolve => {
            board_private = board_private ? 'true' : 'false';
            const boardDetailsPromise = this.generateBoardDetails(id, isNewBoard);
            boardDetailsPromise.then(boardDetails => {
                const boardsTemplate = `
                    <li class="flex-row-start" boardId="${id}" boardPrivate="${board_private}">
                        <div class="title flex-row-start">
                            <div class="col-title">
                                <h3>${title}</h3>
                            </div>                       
                        </div>
                        <div class="board-details flex-row-end">
                            <i class="detail-button fas fa-ellipsis-h" boardId="${id}"></i>
                        </div>
                    </li>
                    <div class="cards-container flex-row-start hide-details" containerBoardId="${id}">${boardDetails}</div>
                `;
                resolve(boardsTemplate);
            });
        });
    },

    generateBoardDetails: function (id, isNewBoard) {
        return new Promise(resolve => {
            if (isNewBoard) {
                this.generateDefaultColumns(resolve, id).then(r => resolve());
            } else {
                generateColumns(resolve, id);
            }
        });
    },

    generateDefaultColumns: async function (resolve, id) {
        let cardList = '';
        for (let [index, columnName] of defaultColumns.entries()) {
            console.log(index)
            const columnData = {
                title: columnName,
                board_id: id,
                order_number: index
            }
            await this.createNewColumnPromise(columnData)
                .then(result => {
                    let statusId = result;
                    console.log(statusId);
                    cardList += `
                <div class='cell' status-id="${statusId}" status-order-number='${index}'>
                    <h3>${columnName}</h3>
                    <div class="tasks flex-column" cardId="${id}"></div>
                </div>
                `;
                    if (index === defaultColumns.length - 1) {
                        console.log(index);
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
                resolve(response.id);
            });
        });
    },

    handleDetailButton: function () {
        const detailBtn = document.querySelectorAll('.detail-button');

        detailBtn.forEach(button => {
            generator.handleBoardDetailsEvent(button);
        });
    },

    handleRefreshButton: function () {
        const refreshButton = document.getElementById('refresh-button');
        refreshButton.addEventListener('click', () => window.location.reload());
    },

    assignCards: function (cards) {
        cards.forEach(card => {
            let column = document.querySelector(`.cell[status-id="${card.status_id}"] .tasks`);
            const task = this.createNewTask(card.id, card.title, card.order_number);
            column.appendChild(task);
        });
    },

    getLastButton: function () {
        const buttons = [...document.querySelectorAll('.board-details > i')];
        return buttons[buttons.length - 1];
    },

    initNewColumnsWithDragAndDrop: function (board_id) {
        initColumns(document.querySelectorAll(`div[containerBoardId="${board_id}"] .tasks`));
    },

    createNewTask: function (taskId, title, orderNumber) {
        const task = util.createElementWithClasses('div', ['task'])
        task.setAttribute('task-id', taskId);
        task.setAttribute('order-number', orderNumber);

        const taskTitle = util.createElementWithClasses('div', ['task-title']);
        taskTitle.textContent = title;
        task.appendChild(taskTitle);

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

    handleBoardDetailsEvent: function (button) {
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
