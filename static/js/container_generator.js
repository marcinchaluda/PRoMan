import { dom } from './dom.js';
import {initColumns} from "./drag_and_drop_handler.js";
import {
    createDeleteCardButton,
    createEditCardButton
} from "./card_handler.js";
import {dataHandler} from "./data_handler.js";

const defaultColumns = ['New', 'In Progress', 'Testing', 'Done'];
const taskContainer = 1;

export function generateBoards(boards) {
    return new Promise(resolve => {
        let boardList = '';
        if (Object.keys(boards).length === 0) {
            resolve(boardList);
        } else {
            for(let [index, board] of boards.entries()){
                const templateOfBoardsPromise = createTemplateOfBoardsHTML(board.title, board.board_private ,board.id);
                templateOfBoardsPromise.then(result => {
                    boardList += result;
                    if (index === Object.keys(boards).length - 1) {
                        resolve(boardList);
                    }
                })
                // dom.loadCards(board.id);
            }
        }
    })

}

export function createTemplateOfBoardsHTML(title, board_private, id, isNewBoard=false){
        return new Promise(resolve => {
        board_private = board_private ? 'true' : 'false';
        const boardDetailsPromise = generateBoardDetails(id, isNewBoard);
        boardDetailsPromise.then(boardDetails => {
                const boardsTemplate = `
                    <li class="flex-row-start" boardId="${id}" boardPrivate="${board_private}">
                        <div class="title flex-row-start">
                            <div class="col-title">
                                <h3>${title}</h3>
                            </div>                       
                            <a href="#" type="button">
                                <i class="fas fa-plus-circle"></i>New card
                            </a>
                        </div>
                        <div class="board-details flex-row-end">
                            <i class="detail-button fas fa-ellipsis-h" boardId="${id}"></i>
                        </div>
                    </li>
                    <div class="cards-container flex-row-start hide-details" containerBoardId="${id}">${boardDetails}</div>
                `;
                resolve(boardsTemplate);
            })
    })
}

export function generateBoardDetails(id, isNewBoard) {
    return new Promise(resolve => {
        if (isNewBoard) {
            generateDefaultColumns(resolve, id).then(r => resolve());
        } else {
            generateColumns(resolve, id);
        }
    })
}

async function generateDefaultColumns(resolve, id) {
    let cardList = '';
    for (let [index, columnName] of defaultColumns.entries()) {
        console.log(index)
        const columnData = {
            title: columnName,
            board_id: id,
            order_number: index
        }
        await createNewColumnPromise(columnData)
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
            })
    }
}

function generateColumns(resolve, id) {
    let cardList = '';
    getColumnsByBoardId(id)
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
        })
}

export function getColumnsByBoardId(id) {
    return new Promise(resolve => {
        dataHandler.getColumnsByBoardId(id, response => {
            const columns = response.columns;
            resolve(columns);
        })
    })
}

function createNewColumnPromise(columnData) {
    return new Promise(resolve => {
        dataHandler.createColumn(columnData, (response) => {
            let statusId = response.id;
            resolve(statusId);
        })
    })
}

export function handleDetailButton() {
    const detailBtn = document.querySelectorAll('.detail-button');

    detailBtn.forEach(button => {
        handleEvent(button);
    });
}

export function handleRefreshButton() {
    const refreshButton = document.getElementById('refresh-button');
    refreshButton.addEventListener('click', () => window.location.reload());
}

export function handleEvent(button) {
    button.addEventListener('click', function () {
        button.getAttribute('boardId');
        const cardsContainer = button.parentElement.parentElement.nextElementSibling;
        cardsContainer.classList.toggle('show');

        button.className = button.classList.contains('fa-ellipsis-h') ?
            'detail-button fas fa-times' : 'detail-button fas fa-ellipsis-h';
    });
}

export function assignCards(cards) {
    cards.forEach(card => {
        let column = document.querySelector(`.cell[status-id="${card.status_id}"]`);
        createColumn(column.querySelector(".tasks"), card);
    });
}

export function createColumn (column, card) {
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
}

export function getLastButton() {
    const buttons = [...document.querySelectorAll('.board-details > i')];
    return buttons[buttons.length - 1];
}

export function initNewColumnsWithDragAndDrop(board_id) {
    initColumns(document.querySelectorAll(`div[containerBoardId="${board_id}"] .tasks`));
}

export function createNewTask(title, taskId, taskNumberOrder) {
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
}

export function markPrivateBoard(board_details, board_id) {
    if (board_details.board_private === true) {
       const boardTitleContainer = document.querySelector(`li[boardId="${board_id}"] .col-title`);
       const lockIcon = '<i class="fas fa-user-lock"></i>';
       const icons = document.getElementsByClassName('div.title fas fa-user-lock');
       if (icons.length === 0) {
           boardTitleContainer.insertAdjacentHTML("afterbegin", lockIcon);
       }
    }
    stylePrivateBoard(board_details, board_id);
}

function stylePrivateBoard(board_details, board_id) {
    if (board_details.board_private === true){
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
