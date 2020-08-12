import { dom } from './dom.js';
import {initColumns} from "./drag_and_drop_handler.js";

const defaultColumns = {0: 'New', 1: 'In Progress', 2: 'Testing', 3:'Done'};
const taskContainer = 1;

export function generateBoards(boards) {
    let boardList = '';

    for(let board of boards){
        boardList += createTemplateOfBoardsHTML(board.title, board.board_private, board.id);
        dom.loadCards(board.id);
    }
    return boardList;
}

export function createTemplateOfBoardsHTML(title, board_private, id){
    board_private = board_private ? 'true' : 'false';
    return `
            <li class="flex-row-start" boardId="${id}" boardPrivate="${board_private}">
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
            <div class="cards-container flex-row-start hide-details" containerBoardId="${id}">${generateBoardDetails(id)}</div>
        `;
}

export function generateBoardDetails(id) {
    let cardList = '';

    for (let index in defaultColumns) {
        cardList += `
            <div class='cell' id="${defaultColumns[index]}" status-id='${index}'>
                <h3>${defaultColumns[index]}</h3>
                <div class="tasks flex-column" cardId="${id}"></div>
            </div>
        `;
    }
    return cardList;
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

export function assignTask(cards) {

    cards.forEach(card => {
        const tasks = [...document.querySelector(`[containerBoardId="${card.board_id}"]`).children];
        tasks.forEach(column => {
            createColumn(column, card);
        });
    });
}

export function createColumn (column, card) {
    const columnName = defaultColumns[card.status_id];

    if (column.getAttribute('id') === columnName) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.setAttribute('task-id', card.id);
        task.setAttribute('order-number', card.order_number);
        task.textContent = card.title;
        column.children[taskContainer].appendChild(task);
    }
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

    return task;
}

export function markPrivateBoard(boards) {
    boards.forEach(board => {
       if (board.board_private) {
           const boardTitleContainer = document.querySelector('li div.title');
           const lockIcon = '<i class="fas fa-user-lock"></i>';

           boardTitleContainer.insertAdjacentHTML("afterbegin", lockIcon);
           stylePrivateBoard(board);
       }
    });
}

function stylePrivateBoard(board) {
    const li = document.querySelector('li');
    const cards = document.querySelectorAll(`div[containerBoardId="${board.id}"] .cell h3`);

    li.classList.add('private');
    cards.forEach(card => {
       card.classList.add('private');
    });
}