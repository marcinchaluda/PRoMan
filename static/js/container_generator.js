import { dom } from './dom.js';
import {initColumns} from "./drag_and_drop_handler.js";
import { createDeleteCardButton } from "./card_handler.js";
import {dataHandler} from "./data_handler.js";

const defaultColumns = {0: 'New', 1: 'In Progress', 2: 'Testing', 3:'Done'};
// const taskContainer = 1;

export function generateBoards(boards) {
    return new Promise(resolve => {
        let boardList = '';
        let boardIndex = 0;
        if (Object.keys(boards).length === 0) {
            resolve(boardList);
        } else {
            for(let board of boards){
                const templateOfBoardsPromise = createTemplateOfBoardsHTML(board.title, board.id);
                templateOfBoardsPromise.then(result => {
                    boardList += result;
                    if (boardIndex === Object.keys(boards).length - 1) {
                        resolve(boardList);
                    }
                    boardIndex ++;
                })
                // dom.loadCards(board.id);
            }
        }
    })

}

export function createTemplateOfBoardsHTML(title, id, isNewBoard=false){
    return new Promise(resolve => {
        const boardDetailsPromise = generateBoardDetails(id, isNewBoard);
        boardDetailsPromise.then(boardDetails => {
                const boardsTemplate = `
                    <li class="flex-row-start" boardId="${id}">
                        <div class="title flex-row-start">
                            <h3>${title}</h3>
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
            generateDefaultColumns(resolve, id);
        } else {
            generateColumns(resolve, id);
        }
    })
}

function generateDefaultColumns(resolve, id) {
    let cardList = '';
    for (let index in defaultColumns) {
        console.log(index)
        const columnData = {
            title: defaultColumns[index],
            board_id: id,
            order_number: index
        }
        createNewColumnPromise(columnData)
            .then(result => {
                let statusId = result;
                console.log(statusId);
                cardList += `
                <div class='cell' status-id="${statusId}" status-order-number='${index}'>
                    <h3>${defaultColumns[index]}</h3>
                    <div class="tasks flex-column" cardId="${id}"></div>
                </div>
                `;
                if (parseInt(index) === Object.keys(defaultColumns).length - 1) {
                    console.log(cardList);
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

export function handleEvent (button) {
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
        task.textContent = card.title;

        // #TODO extract to new function
        const buttonPanel = document.createElement('div');
        buttonPanel.classList.add('button-panel');
        buttonPanel.appendChild(createDeleteCardButton(task, card.id));
        task.appendChild(buttonPanel);

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
    task.textContent = title;
    task.classList.add('task');
    task.setAttribute('task-id', taskId);
    task.setAttribute('order-number', taskNumberOrder);

    // #TODO extract to new function
    const buttonPanel = document.createElement('div');
    buttonPanel.classList.add('button-panel');
    buttonPanel.appendChild(createDeleteCardButton(task, taskId));
    task.appendChild(buttonPanel);

    return task;
}
